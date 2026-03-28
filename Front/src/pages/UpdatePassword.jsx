import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../api/ApiUser';

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleUpdate = async () => {
    setMessage('');
    if (newPassword !== confirmPassword) {
      setMessage("❌ Les nouveaux mots de passe ne correspondent pas !");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.telephone) {
        setMessage("❌ Utilisateur non trouvé. Veuillez vous reconnecter.");
        return;
      }

      const response = await userService.changePassword(user.telephone, oldPassword, newPassword);
      alert("✅ " + response); // response.data si ton service renvoie { data: "..." }

      navigate('/dashboard');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setMessage("❌ Ancien mot de passe incorrect.");
      } else {
        setMessage("❌ Une erreur est survenue. Veuillez réessayer.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-md shadow-md w-96">
        <h2 className="text-xl font-bold mb-4 text-center text-blue-600">Changer votre mot de passe</h2>
        {message && <p className="text-center mb-4 text-sm text-red-500">{message}</p>}

        <input
          type="password"
          placeholder="Ancien mot de passe"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full p-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Confirmer le nouveau mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleUpdate}
          className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition"
        >
          Mettre à jour le mot de passe
        </button>
      </div>
    </div>
  );
};

export default UpdatePassword;
