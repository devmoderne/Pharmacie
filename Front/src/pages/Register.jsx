import React, { useState, useEffect } from 'react';
import userService from '../api/ApiUser';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nom: '', prenoms: '', telephone: '', password: '', role: 'USER' });
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Vérifie si l'utilisateur courant est un ADMIN
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.roles && user.roles.includes("ADMIN")) {
      setIsAdmin(true);
    }
  }, []);

  // Fonction pour gérer l'enregistrement
const handleRegister = async () => {
  setError('');
  try {
    const { nom, prenoms, telephone, password, role } = form;

    // Inclure roleId dans le payload
    const userData = { 
      nom, 
      prenoms, 
      telephone, 
      password, 
      roleId: isAdmin ? parseInt(role) : 1  // 1 = USER par défaut
    };

    // Création de l'utilisateur
    const response = await userService.addUser(userData);

    alert("Utilisateur enregistré avec succès !");
    navigate("/login");
  } catch (err) {
    console.error("Erreur lors de l'enregistrement :", err);
    setError("Erreur lors de l'enregistrement, veuillez vérifier les informations.");
  }
};


  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Créer un utilisateur</h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <input
          type="text"
          placeholder="Nom"
          value={form.nom}
          onChange={(e) => setForm({ ...form, nom: e.target.value })}
          className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Prénoms"
          value={form.prenoms}
          onChange={(e) => setForm({ ...form, prenoms: e.target.value })}
          className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Téléphone"
          value={form.telephone}
          onChange={(e) => setForm({ ...form, telephone: e.target.value })}
          className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

       {isAdmin && (
  <select
    value={form.role}
    onChange={(e) => setForm({ ...form, role: e.target.value })}
    className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
  >
    <option value="1">USER</option>
    <option value="2">ADMIN</option>
    <option value="3">SUPER_ADMIN</option>
  </select>
)}


        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
        >
          Créer le compte
        </button>
      </div>
    </div>
  );
};

export default Register;
