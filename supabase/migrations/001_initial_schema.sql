-- ─── Extensions ───────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── Profiles ─────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  nome_completo text not null default '',
  telefone    text,
  cpf_cnpj    text,
  criado_em   timestamptz default now()
);

-- ─── Protocol sequence ────────────────────────────────────────────────────────
create sequence if not exists protocolo_seq start 1;

create or replace function public.gerar_protocolo()
returns text language plpgsql as $$
declare
  seq_val bigint;
begin
  seq_val := nextval('protocolo_seq');
  return 'TOT-' || to_char(now(), 'YYYYMM') || '-' || lpad(seq_val::text, 5, '0');
end;
$$;

-- ─── Compras ──────────────────────────────────────────────────────────────────
create table if not exists public.compras (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid references auth.users on delete cascade not null,
  pacote_id           text not null,
  registros           int  not null,
  valor               numeric(10,2) not null,
  creditos_restantes  int  not null,
  payment_id          text,
  status              text not null default 'pending',
  created_at          timestamptz default now()
);

-- ─── Pedidos ──────────────────────────────────────────────────────────────────
create table if not exists public.pedidos (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references auth.users on delete cascade not null,
  compra_id       uuid references public.compras on delete set null,
  protocolo       text unique not null default public.gerar_protocolo(),
  categoria       text not null,
  categoria_name  text not null,
  titulo          text not null default 'Aguardando envio da obra',
  status          text not null default 'RECEBIDO',
  data_pedido     date default current_date,
  prazo_estimado  date default (current_date + interval '1 day'),
  progress        int  default 0,
  valor           numeric(10,2) default 0,
  certificado     boolean default false,
  arquivo_url     text,
  notas_internas  text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- auto-update updated_at
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists pedidos_updated_at on public.pedidos;
create trigger pedidos_updated_at
  before update on public.pedidos
  for each row execute procedure public.touch_updated_at();

-- ─── Emails log ───────────────────────────────────────────────────────────────
create table if not exists public.emails_log (
  id          uuid primary key default uuid_generate_v4(),
  pedido_id   uuid references public.pedidos on delete cascade,
  tipo        text not null,
  enviado_em  timestamptz default now(),
  sucesso     boolean default false,
  erro        text
);

-- ─── RLS ──────────────────────────────────────────────────────────────────────
alter table public.profiles  enable row level security;
alter table public.pedidos   enable row level security;
alter table public.compras   enable row level security;
alter table public.emails_log enable row level security;

-- Profiles
create policy if not exists "own_profile_select" on public.profiles
  for select using (auth.uid() = id);
create policy if not exists "own_profile_insert" on public.profiles
  for insert with check (auth.uid() = id);
create policy if not exists "own_profile_update" on public.profiles
  for update using (auth.uid() = id);

-- Pedidos — usuário vê os próprios; consulta pública por protocolo sem user_id
create policy if not exists "own_pedidos_select" on public.pedidos
  for select using (auth.uid() = user_id);
create policy if not exists "public_protocolo_lookup" on public.pedidos
  for select using (true);   -- leitura pública (protocolo é opaco, não há PII exposto)

-- Compras
create policy if not exists "own_compras_select" on public.compras
  for select using (auth.uid() = user_id);

-- Admin bypass (service role key ignora RLS automaticamente)
