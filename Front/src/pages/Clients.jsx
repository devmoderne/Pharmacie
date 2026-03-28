import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import clientService from '../api/ApiClient'; // ton fichier service que tu as montré

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState({ nom: '', telephone: '', adresse: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Charger tous les clients
  const loadClients = async () => {
    setLoading(true);
    try {
      const data = await clientService.getAllClients();
      setClients(data);
    } catch (error) {
      console.error('Erreur chargement clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  // Ouvrir la modale
  const openModal = (client = null) => {
    if (client) {
      setCurrentClient(client);
      setIsEditing(true);
    } else {
      setCurrentClient({ nom: '', telephone: '', adresse: '' });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentClient({ nom: '', telephone: '', adresse: '' });
    setIsEditing(false);
  };

  // Sauvegarder ajout ou édition
  const handleSave = async () => {
    if (!currentClient.nom || !currentClient.telephone) {
      alert('Le nom et le téléphone sont requis.');
      return;
    }

    try {
      if (isEditing) {
        const updated = await clientService.updateClient(currentClient.id, currentClient);
        setClients(clients.map(c => (c.id === updated.id ? updated : c)));
      } else {
        const added = await clientService.addClient(currentClient);
        setClients([...clients, added]);
      }
      closeModal();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du client:', error);
      alert('Une erreur est survenue.');
    }
  };

const handleDelete = async (id) => {
  try {
    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer ce client ?");
    if (!confirmDelete) return;

    const res = await clientService.deleteClient(id);

    // Si le backend renvoie OK
    setClients(prev => prev.filter(c => c.id !== id));
    alert("Client supprimé avec succès !");
    
  } catch (error) {
    console.error("Erreur suppression : ", error);
    alert("Impossible de supprimer ce client.");
  }
};


  // Filtrage par recherche
  const filteredClients = clients.filter(c =>
    c.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.telephone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {loading && (
        <div className="bg-blue-200 text-blue-800 p-2 rounded-md mb-4">
          Chargement des clients...
        </div>
      )}

      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Clients</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher..."
              className="p-2 pl-10 border rounded-md"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          <button
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            onClick={() => openModal()}
          >
            <FaPlus /><span>Ajouter</span>
          </button>
        </div>
      </div>

      {/* Tableau des clients */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left">Nom</th>
              <th className="py-3 px-4 text-left">Téléphone</th>
              <th className="py-3 px-4 text-left">Adresse</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map(c => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{c.nom}</td>
                <td className="py-3 px-4">{c.telephone}</td>
                <td className="py-3 px-4">{c.adresse}</td>
                <td className="py-3 px-4 flex space-x-3">
                  <button onClick={() => openModal(c)} className="text-blue-500 hover:text-blue-700"><FaEdit /></button>
                  <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modale */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">
              {isEditing ? 'Modifier un client' : 'Ajouter un client'}
            </h3>

            <input
              type="text"
              className="w-full p-2 border rounded-md mb-4"
              placeholder="Nom"
              value={currentClient.nom}
              onChange={e => setCurrentClient({ ...currentClient, nom: e.target.value })}
            />
            <input
              type="text"
              className="w-full p-2 border rounded-md mb-4"
              placeholder="Téléphone"
              value={currentClient.telephone}
              onChange={e => setCurrentClient({ ...currentClient, telephone: e.target.value })}
            />
            <input
              type="text"
              className="w-full p-2 border rounded-md mb-4"
              placeholder="Adresse"
              value={currentClient.adresse}
              onChange={e => setCurrentClient({ ...currentClient, adresse: e.target.value })}
            />

            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {isEditing ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
