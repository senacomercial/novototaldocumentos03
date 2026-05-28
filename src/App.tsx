import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Tweaks } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Consultar } from './pages/Consultar';
import { Obrigado } from './pages/Obrigado';

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
    const path = window.location.pathname;
    setCurrentRoute(path);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header route={currentRoute} navigate={navigate} loggedIn={loggedIn} />

      <Routes>
        <Route path="/" element={<Landing navigate={navigate} tweaks={tweaks} />} />
        <Route path="/dashboard" element={<Dashboard navigate={navigate} />} />
        <Route path="/consultar" element={<Consultar navigate={navigate} />} />
        <Route path="/obrigado" element={<Obrigado navigate={navigate} />} />
        {/* Placeholder routes for future pages */}
        <Route path="/login" element={<div className="container" style={{ paddingTop: '48px' }}>Login Page (Coming Soon)</div>} />
        <Route path="/cadastro" element={<div className="container" style={{ paddingTop: '48px' }}>Cadastro Page (Coming Soon)</div>} />
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
