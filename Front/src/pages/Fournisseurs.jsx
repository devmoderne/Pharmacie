import React, { useState, useEffect } from 'react';
import FournisseurService from '../api/ApiFournisseur';
import { FaSearch, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const Fournisseurs = () => {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFournisseur, setCurrentFournisseur] = useState({ nom: '', adresse: '', telephone: '' });

  const loadFournisseurs = async () => {
    try {
      const data = await FournisseurService.getAllFournisseurs();

      // Si ton API renvoie un objet (ex: { content: [...] } ou { data: [...] }),
      // adapte ici :
      setFournisseurs(Array.isArray(data) ? data : data.content || data.data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des fournisseurs :", error);
    }
  };

  useEffect(() => { loadFournisseurs(); }, []);

  // ✅ Utilisation correcte du state
  const filtered = fournisseurs.filter(f =>
    f.nom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (f = null) => {
    if (f) {
      setCurrentFournisseur({ ...f });
      setIsEditing(true);
    } else {
      setCurrentFournisseur({ nom: '', adresse: '', telephone: '' });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentFournisseur({ nom: '', adresse: '', telephone: '' });
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await FournisseurService.updateFournisseur(currentFournisseur.id, currentFournisseur);
        setFournisseurs(fournisseurs.map(f => f.id === currentFournisseur.id ? { ...f, ...currentFournisseur } : f));
      } else {
        const newF = await FournisseurService.addFournisseur(currentFournisseur);
        setFournisseurs(prev => [...prev, newF]);
      }
      closeModal();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
      alert('Erreur !');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce fournisseur ?')) {
      try {
        await FournisseurService.deleteFournisseur(id);
        setFournisseurs(fournisseurs.filter(f => f.id !== id));
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        alert('Erreur !');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Fournisseurs</h2>
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
            onClick={() => openModal()}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <FaPlus /><span>Ajouter</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th>Nom</th><th>Adresse</th><th>Téléphone</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(f => (
              <tr key={f.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{f.nom}</td>
                <td className="py-3 px-4">{f.adresse}</td>
                <td className="py-3 px-4">{f.telephone}</td>
                <td className="py-3 px-4 flex space-x-3">
                  <button onClick={() => openModal(f)} className="text-blue-500 hover:text-blue-700"><FaEdit /></button>
                  <button onClick={() => handleDelete(f.id)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">{isEditing ? 'Modifier' : 'Ajouter'} Fournisseur</h3>
            <input type="text" className="w-full p-2 mb-2 border rounded-md"
              placeholder="Nom"
              value={currentFournisseur.nom}
              onChange={e => setCurrentFournisseur({ ...currentFournisseur, nom: e.target.value })} />
            <input type="text" className="w-full p-2 mb-2 border rounded-md"
              placeholder="Adresse"
              value={currentFournisseur.adresse}
              onChange={e => setCurrentFournisseur({ ...currentFournisseur, adresse: e.target.value })} />
            <input type="text" className="w-full p-2 mb-4 border rounded-md"
              placeholder="Téléphone"
              value={currentFournisseur.telephone}
              onChange={e => setCurrentFournisseur({ ...currentFournisseur, telephone: e.target.value })} />
            <div className="flex justify-end space-x-4">
              <button onClick={closeModal} className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500">Annuler</button>
              <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                {isEditing ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fournisseurs;
