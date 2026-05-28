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
    setCurrentRoute(window.location.pathname);

    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
      setCurrentRoute(window.location.pathname);
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        route={currentRoute}
        navigate={navigate}
        loggedIn={loggedIn}
        onLogout={handleLogout}
      />

      <Routes>
        <Route path="/" element={<Landing navigate={navigate} tweaks={tweaks} />} />
        <Route path="/dashboard" element={<Dashboard navigate={navigate} />} />
        <Route path="/consultar" element={<Consultar navigate={navigate} />} />
        <Route path="/obrigado" element={<Obrigado navigate={navigate} />} />
        <Route path="/login" element={<Login navigate={navigate} onLogin={handleLogin} />} />
        <Route path="/cadastro" element={<Cadastro navigate={navigate} onLogin={handleLogin} />} />
      </Routes>

      <Footer navigate={navigate} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
