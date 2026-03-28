import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../api/ApiUser';

function Login({ setIsAuthenticated, setUser }) {
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
      navigate('/dashboard');
    }
  }, [setIsAuthenticated, setUser, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await authService.login(telephone, password);
    
if (response && response.token && response.user) {
  setUser(response.user);
  setIsAuthenticated(true);
  navigate('/dashboard');
} else {
  setError("Réponse du serveur invalide");
}

    } catch (err) {
      console.error("Erreur de login :", err);
      setError("Échec de la connexion. Vérifiez vos identifiants.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md w-96" onSubmit={handleLogin}>
        <h2 className="text-2xl font-semibold mb-4">Connexion</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}

        <div className="mb-4">
          <label className="block text-gray-700">Téléphone</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700">Mot de passe</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}

export default Login;
