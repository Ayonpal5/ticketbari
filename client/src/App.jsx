import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import AllTickets from './pages/AllTickets';
import TicketDetails from './pages/TicketDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const getUserFromStorage = () => {
  const item = localStorage.getItem('ticketbari_user');
  return item ? JSON.parse(item) : null;
};

function App() {
  const [user, setUser] = useState(getUserFromStorage());
  const [theme, setTheme] = useState(localStorage.getItem('ticketbari_theme') || 'light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('ticketbari_theme', theme);
  }, [theme]);

  const handleLogin = (userData) => {
    localStorage.setItem('ticketbari_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('ticketbari_user');
    localStorage.removeItem('ticketbari_token');
    setUser(null);
  };

  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

  return (
    <Elements stripe={stripePromise}>
      <BrowserRouter>
        <Navbar user={user} onLogout={handleLogout} theme={theme} setTheme={setTheme} />
        <main className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tickets" element={<AllTickets />} />
            <Route path="/tickets/:id" element={<ProtectedRoute user={user}><TicketDetails user={user} /></ProtectedRoute>} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onRegister={handleLogin} />} />
            <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard user={user} /></ProtectedRoute>} />
            <Route path="/payment-success" element={<ProtectedRoute user={user}><PaymentSuccess /></ProtectedRoute>} />
            <Route path="/payment-cancel" element={<ProtectedRoute user={user}><PaymentCancel /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </Elements>
  );
}

export default App;
