// Main App — Totalis prototype

const { useState: useStateA, useEffect: useEffectA } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "purple",
  "theme": "dark",
  "density": "regular",
  "typeStyle": "serif-accent",
  "categoryLayout": "grid",
  "headline": "Registre sua obra e ",
  "headlineAccent": "fique tranquilo."
}/*EDITMODE-END*/;

// Accent palettes mapped from name
const ACCENT_MAP = {
  purple: { soft: '#c084fc', main: '#a855f7', deep: '#7c3aed' },
  blue:   { soft: '#7dd3fc', main: '#3b82f6', deep: '#1d4ed8' },
  emerald: { soft: '#6ee7b7', main: '#10b981', deep: '#047857' },
  magenta: { soft: '#f9a8d4', main: '#ec4899', deep: '#be185d' },
  amber:  { soft: '#fcd34d', main: '#f59e0b', deep: '#b45309' },
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = useStateA('/');
  const [loggedIn, setLoggedIn] = useStateA(false);
  const [payload, setPayload] = useStateA(null);

  function navigate(path, scrollTo, p) {
    window.__scrollTarget = scrollTo || null;
    if (p) setPayload(p);
    setRoute(path);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // Apply tweaks to root
  useEffectA(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', t.theme);
    root.setAttribute('data-density', t.density);
    root.setAttribute('data-type', t.typeStyle);

    const palette = ACCENT_MAP[t.accent] || ACCENT_MAP.purple;
    root.style.setProperty('--accent', palette.main);
    root.style.setProperty('--accent-soft', palette.soft);
    root.style.setProperty('--accent-deep', palette.deep);
    // Border-accent recompute (rgba alpha 0.32 of main)
    const hex = palette.main.replace('#', '');
    const r = parseInt(hex.slice(0,2), 16), g = parseInt(hex.slice(2,4), 16), b = parseInt(hex.slice(4,6), 16);
    root.style.setProperty('--border-accent', `rgba(${r}, ${g}, ${b}, 0.32)`);
  }, [t.theme, t.density, t.typeStyle, t.accent]);

  let page;
  if (route === '/dashboard') {
    if (!loggedIn) { /* auto-login for demo */ }
    page = <Dashboard navigate={navigate} />;
  } else if (route === '/consultar') {
    page = <Consultar navigate={navigate} />;
  } else if (route === '/login') {
    page = <Login navigate={navigate} doLogin={() => setLoggedIn(true)} />;
  } else if (route === '/obrigado') {
    page = <Obrigado navigate={navigate} payload={payload} />;
  } else {
    page = <Landing navigate={navigate} tweaks={t} setTweak={setTweak} />;
  }

  return (
    <div className="page">
      <Header route={route} navigate={navigate} loggedIn={loggedIn || route === '/dashboard'} />
      {page}
      <Footer navigate={navigate} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Cor de acento" />
        <TweakColor label="Acento" value={ACCENT_MAP[t.accent].main}
          options={Object.values(ACCENT_MAP).map(p => p.main)}
          onChange={(v) => {
            const name = Object.keys(ACCENT_MAP).find(k => ACCENT_MAP[k].main === v) || 'purple';
            setTweak('accent', name);
          }}
        />

        <TweakSection label="Tema" />
        <TweakRadio label="Modo" value={t.theme}
          options={['dark', 'light']}
          onChange={(v) => setTweak('theme', v)} />

        <TweakSection label="Tipografia" />
        <TweakRadio label="Estilo" value={t.typeStyle}
          options={['serif-accent', 'bold-sans', 'grotesk']}
          onChange={(v) => setTweak('typeStyle', v)} />

        <TweakSection label="Densidade" />
        <TweakRadio label="Espaçamento" value={t.density}
          options={['compact', 'regular', 'comfy']}
          onChange={(v) => setTweak('density', v)} />

        <TweakSection label="Layout das categorias" />
        <TweakRadio label="Layout" value={t.categoryLayout}
          options={['grid', 'list', 'carousel']}
          onChange={(v) => setTweak('categoryLayout', v)} />

        <TweakSection label="Headline" />
        <TweakText label="Texto" value={t.headline}
          onChange={(v) => setTweak('headline', v)} />
        <TweakText label="Destaque (italic)" value={t.headlineAccent}
          onChange={(v) => setTweak('headlineAccent', v)} />

        <TweakSection label="Atalhos" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <TweakButton label="Landing" onClick={() => navigate('/')} />
          <TweakButton label="Pacotes" onClick={() => navigate('/', 'pacotes')} />
          <TweakButton label="Obrigado" onClick={() => navigate('/obrigado')} />
          <TweakButton label="Login" onClick={() => navigate('/login')} />
          <TweakButton label="Dashboard" onClick={() => { setLoggedIn(true); navigate('/dashboard'); }} />
          <TweakButton label="Consultar" onClick={() => navigate('/consultar')} />
        </div>
      </TweaksPanel>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
