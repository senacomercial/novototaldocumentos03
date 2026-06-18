import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Tweaks } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Consultar } from './pages/Consultar';
import { Obrigado } from './pages/Obrigado';
import { Login } from './pages/Login';
import { Cadastro } from './pages/Cadastro';
import { Admin } from './pages/Admin';
import { supabase } from './lib/supabase';

const DEFAULT_TWEAKS: Tweaks = {
  headline: 'Registre suas obras com segurança',
  headlineAccent: ' jurídica e prova em blockchain',
  accent: 'purple',
  theme: 'dark',
  density: 'regular',
  typeStyle: 'serif-accent',
  categoryLayout: 'grid',
};

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentRoute, setCurrentRoute] = useState('/');
  const [tweaks] = useState<Tweaks>(DEFAULT_TWEAKS);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirectPath = params.get('redirect');
    const paymentStatus = params.get('status') || params.get('collection_status');
    const paymentId = params.get('payment_id') || params.get('collection_id');

    if (redirectPath) {
      // Must use React Router's navigate (not window.history.replaceState directly)
      // so BrowserRouter actually re-renders the matched <Route>, not just the URL bar.
      navigate(redirectPath, { replace: true });
      setCurrentRoute(redirectPath);
    } else if (paymentId && (paymentStatus === 'approved' || paymentStatus === 'pending')) {
      // MP redirected back after payment — go to dashboard
      navigate('/dashboard', { replace: true });
      setCurrentRoute('/dashboard');
    } else {
      const base = window.location.hostname.includes('github.io') ? '/novototaldocumentos03' : '';
      setCurrentRoute(window.location.pathname.replace(base, '') || '/');
    }

    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
      const base = window.location.hostname.includes('github.io') ? '/novototaldocumentos03' : '';
      setCurrentRoute(window.location.pathname.replace(base, '') || '/');
    });

    return () => subscription.unsubscribe();
  }, []);

  function handleLogin() {
    setLoggedIn(true);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setLoggedIn(false);
    navigate('/');
  }

  function handleNavigate(path: string, section?: string) {
    navigate(path);
    if (section) {
      setTimeout(() => {
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        route={currentRoute}
        navigate={handleNavigate}
        loggedIn={loggedIn}
        onLogout={handleLogout}
      />

      <Routes>
        <Route path="/" element={<Landing navigate={handleNavigate} tweaks={tweaks} />} />
        <Route path="/dashboard" element={<Dashboard navigate={handleNavigate} />} />
        <Route path="/consultar" element={<Consultar navigate={handleNavigate} />} />
        <Route path="/obrigado" element={<Obrigado navigate={handleNavigate} />} />
        <Route path="/login" element={<Login navigate={handleNavigate} onLogin={handleLogin} />} />
        <Route path="/cadastro" element={<Cadastro navigate={handleNavigate} onLogin={handleLogin} />} />
        <Route path="/admin" element={<Admin navigate={handleNavigate} />} />
      </Routes>

      <Footer navigate={handleNavigate} />
    </div>
  );
};

const App: React.FC = () => {
  const isGitHub = window.location.hostname.includes('github.io');
  const basename = isGitHub ? '/novototaldocumentos03/' : '/';

  return (
    <BrowserRouter basename={basename}>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
