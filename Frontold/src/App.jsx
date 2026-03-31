import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Loader from './components/Loader';

import Fournisseurs from './pages/Fournisseurs';
import Produits from './pages/Produits';
import Categories from './pages/Categories';

import Clients from './pages/Clients';
import EntreeStock from './pages/EntreeStock';

import Detailstickets from './pages/Detailstickets'
import Login from './pages/Login';
import Register from './pages/Register';
import UpdatePassword from './pages/UpdatePassword';
import MaVenteDuJourTable from './pages/MaVenteDuJourTable';
import MesVentesTable from './pages/MesVentesTable';
import ChangePassword from "./pages/ChangePassword";




function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.token) {
          setUser(storedUser);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Erreur d'authentification :", error);
        setIsAuthenticated(false);
        setUser(null);
      }
      setIsLoading(false);
    };
    checkAuthStatus();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <Router>
      {isAuthenticated ? (
        <div className="flex flex-col min-h-screen">
          <Header user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} />
          <div className="flex flex-1">
            <Sidebar />
            <div className="flex-1 p-8 bg-gray-100">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Gestion entités */}

                <Route path="/change-password" element={<ChangePassword />} />

                 <Route path="/detailstickets" element={<Detailstickets/>} />

                <Route path="/mesventes" element={<MesVentesTable />} />
                <Route path="/EntreeStocks" element={<EntreeStock />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/fournisseurs" element={<Fournisseurs />} />
                <Route path="/mavente" element={<MaVenteDuJourTable />} />
                <Route path="/categories" element={<Categories />} />
                 <Route path="/produits" element={<Produits />} />
                {/* Auth / Utilisateurs */}
                <Route path="/register" element={<Register />} />
                <Route path="/change" element={<UpdatePassword />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/dashboard"/>} />
              </Routes>
            </div>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
