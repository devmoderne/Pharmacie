import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [isParametreOpen, setIsParametreOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);

    if (storedUser?.roles) {
      setIsAdmin(storedUser.roles.includes('ADMIN') || storedUser.roles.includes('superuser'));
      setIsUser(storedUser.roles.includes('USER'));
    }
  }, []);

  return (
    <div className="bg-blue-800 w-50 p-6 text-white min-h-screen flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold text-center mb-8">Menu</h2>
        <nav>
          <ul className="space-y-1">
            <li>
              <Link to="/dashboard" className="flex items-center p-3 hover:bg-blue-700 rounded-md">
                <i className="fas fa-chart-line mr-3"></i>
                <span>Dashboard</span>
              </Link>
            </li>

            {isUser && (
              <>
                <li>
                  <Link to="/mavente" className="flex items-center p-3 hover:bg-blue-700 rounded-md">
                    <i className="fas fa-calendar-day mr-3"></i>
                    <span>Ma journée</span>
                  </Link>
                </li>

                <li>
                  <Link to="/clients" className="flex items-center p-3 hover:bg-blue-700 rounded-md">
                    <i className="fas fa-user-friends mr-3"></i>
                    <span>Clients</span>
                  </Link>
                </li>
              </>
            )}

            {isAdmin && (
              <>
                <li>
                  <Link to="/comptabilite" className="flex items-center p-3 hover:bg-blue-700 rounded-md">
                    <i className="fas fa-coins mr-3"></i>
                    <span>Ma Comptabilité</span>
                  </Link>
                </li>

                <li>
                  <Link to="/fournisseurs" className="flex items-center p-3 hover:bg-blue-700 rounded-md">
                    <i className="fas fa-truck mr-3"></i>
                    <span>Fournisseurs</span>
                  </Link>
                </li>

                <li>
                  <Link to="/categories" className="flex items-center p-3 hover:bg-blue-700 rounded-md">
                    <i className="fas fa-tags mr-3"></i>
                    <span>Catégories</span>
                  </Link>
                </li>

                <li>
                  <button
                    onClick={() => setIsParametreOpen(!isParametreOpen)}
                    className="flex items-center p-3 hover:bg-blue-700 rounded-md w-full"
                  >
                    <i className="fas fa-cogs mr-3"></i>
                    <span>Paramètres</span>
                    <i className={`fas fa-chevron-${isParametreOpen ? 'up' : 'down'} ml-auto`}></i>
                  </button>

                  {isParametreOpen && (
                    <div className="pl-6 mt-2 space-y-2">
                      <Link to="/register" className="flex items-center p-3 hover:bg-blue-700 rounded-md">
                        <i className="fas fa-user-plus mr-3"></i>
                        <span>Créer un utilisateur</span>
                      </Link>

                      <Link to="/users" className="flex items-center p-3 hover:bg-blue-700 rounded-md">
                        <i className="fas fa-user-edit mr-3"></i>
                        <span>Modifier un utilisateur</span>
                      </Link>
                    </div>
                  )}
                </li>
              </>
            )}

            {/* 🔐 Modifier son mot de passe — visible pour tout le monde */}
            <li>
              <Link
                to="/change-password"
                className="flex items-center p-3 hover:bg-blue-700 rounded-md"
              >
                <i className="fas fa-lock mr-3"></i>
                <span>Modifier mon mot de passe</span>
              </Link>
            </li>

          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
