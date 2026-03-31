import React, { useState, useEffect } from 'react';
import categorieService from '../api/ApiCategorie';
import { FaSearch, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategorie, setCurrentCategorie] = useState({ nomCategorie: '', description: '' });
  const [message, setMessage] = useState('');

  // Charger toutes les catégories
  const loadCategories = async () => {
    try {
      const data = await categorieService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories :', error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Filtrage
  const filteredCategories = categories.filter(cat =>
    (cat.nomCategorie ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ouvrir modal
  const openModal = (categorie = null) => {
    if (categorie) {
      setCurrentCategorie({
        id: categorie.id,
        nomCategorie: categorie.nomCategorie || '',
        description: categorie.description || '',
      });
      setIsEditing(true);
    } else {
      setCurrentCategorie({ nomCategorie: '', description: '' });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentCategorie({ nomCategorie: '', description: '' });
    setMessage('');
  };

  // Sauvegarde
  const handleSave = async () => {
    if (!currentCategorie.nomCategorie.trim()) {
      setMessage('❌ Le nom de la catégorie est requis');
      return;
    }

    try {
      if (isEditing) {
        await categorieService.updateCategorie(currentCategorie.id, currentCategorie);
        setCategories(categories.map(cat =>
          cat.id === currentCategorie.id ? { ...cat, ...currentCategorie } : cat
        ));
        setMessage('✅ Catégorie modifiée avec succès !');
      } else {
        const newCat = await categorieService.addCategorie(currentCategorie);
        setCategories(prev => [...prev, newCat]);
        setMessage('✅ Catégorie ajoutée avec succès !');
      }
      closeModal();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde :', error);
      setMessage('❌ Une erreur est survenue lors de la sauvegarde.');
    }
  };

  // Suppression
  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette catégorie ?')) {
      try {
        await categorieService.deleteCategorie(id);
        setCategories(categories.filter(cat => cat.id !== id));
        alert('Catégorie supprimée avec succès !');
      } catch (error) {
        console.error('Erreur lors de la suppression :', error);
        alert('Une erreur est survenue lors de la suppression !');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {message && (
      <div className={`p-3 mb-4 rounded-md ${message.includes('succès') ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>

          {message}
        </div>
      )}

      {/* Barre de recherche + bouton */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Catégories</h2>
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
            <FaPlus />
            <span>Ajouter</span>
          </button>
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Nom</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Description</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map(cat => (
                <tr key={cat.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-800">{cat.nomCategorie}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{cat.description || '—'}</td>
                  <td className="py-3 px-4 flex space-x-3">
                    <button onClick={() => openModal(cat)} className="text-blue-500 hover:text-blue-700">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-4 text-center text-gray-500">Aucune catégorie trouvée</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal d’ajout/édition */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">{isEditing ? 'Modifier' : 'Ajouter'} une catégorie</h3>

            <label className="block text-gray-700 mb-1">Nom :</label>
            <input
              type="text"
              placeholder="Nom de la catégorie"
              className="w-full p-2 border rounded-md mb-4"
              value={currentCategorie.nomCategorie}
              onChange={e => setCurrentCategorie({ ...currentCategorie, nomCategorie: e.target.value })}
            />

            <label className="block text-gray-700 mb-1">Description :</label>
            <input
              type="text"
              placeholder="Description"
              className="w-full p-2 border rounded-md mb-4"
              value={currentCategorie.description}
              onChange={e => setCurrentCategorie({ ...currentCategorie, description: e.target.value })}
            />

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

export default Categories;
