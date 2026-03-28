import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);

    if (storedUser?.roles) {
      setIsAdmin(storedUser.roles.includes('ADMIN'));
      setIsUser(storedUser.roles.includes('USER'));
    }
  }, []);

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6">
        {/* Carte Caisse → visible pour USER et ADMIN */}
        {(isUser || isAdmin) && (
          <div className="card bg-cover bg-center p-4 h-80 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out" style={{ backgroundImage: 'url(/images/clients-bg.jpg)' }}>
            <Link to="/detailstickets" className="btn btn-primary mt-4">
              <h3 className="text-xl font-semibold text-white">Caisse</h3>
            </Link>
          </div>
        )}

        {/* Carte Stocks → uniquement ADMIN */}
        {isAdmin && (
          <div className="card bg-cover bg-center p-4 h-80 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out" style={{ backgroundImage: 'url(/images/fournisseurs-bg.jpg)' }}>
            <Link to="/fournisseurs" className="btn btn-primary mt-4">
              <h3 className="text-xl font-semibold text-white">Stocks</h3>
            </Link>
          </div>
        )}

        {/* Carte Produits → uniquement ADMIN */}
        {isAdmin && (
          <div className="card bg-cover bg-center p-4 h-80 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out" style={{ backgroundImage: 'url(/images/produits-bg.jpg)' }}>
            <Link to="/produits" className="btn btn-primary mt-4">
              <h3 className="text-xl font-semibold text-white">Produits</h3>
            </Link>
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Carte Entrée de Stock → uniquement ADMIN */}
        {isAdmin && (
          <div className="card bg-cover bg-center p-4 h-80 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out" style={{ backgroundImage: 'url(/images/categories-bg.jpg)' }}>
            <Link to="/EntreeStocks" className="btn btn-primary mt-4">
              <h3 className="text-xl font-semibold text-white">Entreé de Stock</h3>
            </Link>
          </div>
        )}

        {/* Carte Ma journée → USER et ADMIN */}
        {isAdmin && (
          <div className="card bg-cover bg-center p-4 h-80 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out" style={{ backgroundImage: 'url(/images/presentations-bg.jpg)' }}>
            <Link to="/mavente" className="btn btn-primary mt-4">
              <h3 className="text-xl font-semibold text-white">Ma journée</h3>
            </Link>
          </div>
        )}

        {/* Carte Tickets → uniquement ADMIN */}
        {isAdmin && (
          <div className="card bg-cover bg-center p-4 h-80 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out" style={{ backgroundImage: 'url(/images/tickets-bg.jpg)' }}>
            <Link to="/mesventes" className="btn btn-primary mt-4">
              <h3 className="text-xl font-semibold text-white">Tickets</h3>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
