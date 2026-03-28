import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../api/ApiUser';

function Header({ user, setUser, setIsAuthenticated }) {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState('');
  const [loading, setLoading] = useState(false);

  // ============================
  // 🔹 Mise à jour de l'heure
  // ============================
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const formatted = now.toLocaleString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setCurrentTime(formatted);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ============================
  // 🔹 Récupération de l'utilisateur
  // ============================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log("User récupéré depuis localStorage :", parsedUser);
          setUser(parsedUser);
        } else {
          const response = await userService.getCurrentUser(); // si disponible
          console.log("User récupéré depuis API :", response.data);
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        }
      } catch (error) {
        console.error("Erreur récupération user :", error);
      }
    };

    if (!user) fetchUser();
  }, [user, setUser]);

  // ============================
  // 🔹 Déconnexion
  // ============================
  const handleLogout = async () => {
    try {
      setLoading(true);
      await userService.logout();
      setIsAuthenticated(false);
      setUser(null);
      sessionStorage.clear();
      localStorage.removeItem('user');
      console.log("✅ Déconnecté avec succès");
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // 🔹 Affichage
  // ============================
  //console.log("User dans Header pour affichage :", user);

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <div className="text-xl font-bold">Tableau de bord</div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{currentTime}</span>

        {loading ? (
          <span className="text-gray-600">Déconnexion...</span>
        ) : user ? (
          <div className="flex items-center space-x-4">
   <span className="text-gray-700 font-medium">
  👤 {user.nom || user.username} {user.prenoms || ''} ({user.roles?.join(', ')})
</span>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Se déconnecter
            </button>
          </div>
        ) : (
          <span className="text-gray-500 italic">Chargement de l'utilisateur...</span>
        )}
      </div>
    </header>
  );
}

export default Header;
