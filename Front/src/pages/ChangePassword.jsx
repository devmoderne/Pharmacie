import React, { useState, useEffect } from "react";
import userService from "../api/ApiUser";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.username) {
      setUsername(storedUser.username);
    }
  }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return showAlert("error", "Les nouveaux mots de passe ne correspondent pas.");
    }

    try {
      await userService.changePassword(username, oldPassword, newPassword);
      showAlert("success", "Mot de passe modifié avec succès !");
      
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      showAlert("error", "Ancien mot de passe incorrect.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form 
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Modifier mon mot de passe
        </h2>

        {/* ALERTES ÉLÉGANTES */}
        {alert.message && (
          <div
            className={`mb-4 px-4 py-3 rounded animate-fade-in
              ${alert.type === "success" ? 
                "bg-green-100 border border-green-400 text-green-700" :
                "bg-red-100 border border-red-400 text-red-700"
              }`}
          >
            {alert.message}
          </div>
        )}

        {/* USER */}
        <div className="mb-4">
          <label className="block text-gray-700">Utilisateur</label>
          <input
            type="text"
            value={username}
            disabled
            className="w-full border px-3 py-2 rounded bg-gray-200"
          />
        </div>

        {/* OLD PASSWORD */}
        <div className="mb-4">
          <label className="block text-gray-700">Ancien mot de passe</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* NEW PASSWORD */}
        <div className="mb-4">
          <label className="block text-gray-700">Nouveau mot de passe</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="mb-6">
          <label className="block text-gray-700">Confirmer mot de passe</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full transition"
        >
          Mettre à jour
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
