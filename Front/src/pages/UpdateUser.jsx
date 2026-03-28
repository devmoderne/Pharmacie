import React, { useState, useEffect } from 'react';
import authService from '../api/authService';
import { useNavigate } from 'react-router-dom';

const UpdateUser = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', role: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        setForm({
          username: user.username,
          password: '',
          role: user.role
        });
      } catch (err) {
        console.error('Erreur lors de la récupération de l\'utilisateur :', err);
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async () => {
    try {
      await authService.updateUser(form);
      navigate('/dashboard');
    } catch (err) {
      setError('Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Modifier votre profil</h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full p-2 mb-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="USER">Utilisateur</option>
          <option value="ADMIN">Administrateur</option>
        </select>

        <button
          onClick={handleUpdate}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
        >
          Mettre à jour
        </button>
      </div>
    </div>
  );
};

export default UpdateUser;
