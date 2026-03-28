import React, { useState, useEffect } from 'react';
import Apisociete from '../api/apiSociete';
import Apiassurances from '../api/apiAssurance';
import { FaSearch, FaPrint, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const Societes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSociete, setCurrentSociete] = useState({ nom: '', assurance_id: 0, address: '' });  // Mise à jour ici
  const [assurancesData, setAssurancesData] = useState([]);
  const [societesData, setSocietesData] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedAssure, setSelectedAssure] = useState('');

  // Charger les sociétés à partir de l'API
  const loadSociete = async () => {
    try {
      const data = await Apisociete.getSocietes(); 
      setSocietesData(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des sociétés :', error);
    }
  };


  // Charger les assurances à partir de l'API
  const loadAssurances = async () => {
    try {
      const data = await Apiassurances.getAssurances();  
      setAssurancesData(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des assurances :', error);
    }
  };

  useEffect(() => {
    loadSociete();
    loadAssurances();
  }, []);

  // Filtrer les sociétés
  const filteredSocietes = societesData.filter(
    (societe) => societe.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ouvrir la modale pour ajouter ou éditer une société
  const openModal = (societe = null) => {
    if (societe) {
      setCurrentSociete(societe);
      setIsEditing(true);
    } else {
      setCurrentSociete({ nom: '', assurance_id: '', address: '' });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  // Fermer la modale
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentSociete({ nom: '', assurance_id: '', address: '' });
    setMessage('');
  };

  const handleSave = async () => {
     if (isEditing) {
       // Modifier une société
       setSocietesData(societesData.map((societe) =>
         societe.id === currentSociete.id ? currentSociete : societe
       ));
     } else {
       // Ajouter une nouvelle société
       try {
         const newSociete = await Apisociete.addSocietes(currentSociete);
         // Ajouter une nouvelle société
         setSocietesData((prevData) => [...prevData, newSociete]);
         closeModal();  // Fermer la modale après l'ajout
         alert('Société ajoutée avec succès !');
       } catch (error) {
         console.error('Erreur lors de la sauvegarde de la société  voulus :', error);
         alert('Une erreur est survenue lors de l\'ajout de la société voulus ');
       }
     }
     closeModal();
     loadAssurances();
     loadSociete();
   
   };
 
  
  



  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Affichage du message de succès ou d'erreur */}
      {message && (
        <div
          className={`p-4 mb-4 rounded-md ${
            message.includes('succès') ? 'bg-green-200' : 'bg-red-200'
          }`}
        >
          {message}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Sociétés</h2>
        <div className="flex space-x-4">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              className="p-2 pl-10 border rounded-md"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          {/* Imprimer Button */}
          <button className="btn btn-primary flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <FaPrint />
            <span>Imprimer</span>
          </button>
          {/* Ajouter Société Button */}
          <button
            onClick={() => openModal()}
            className="btn btn-primary flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <FaPlus />
            <span>Ajouter Société</span>
          </button>
        </div>
      </div>

      {/* Tableau des Sociétés */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Nom</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Assurance</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Adresse</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSocietes.map((societe) => (
              <tr key={societe.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-sm font-medium text-gray-800">{societe.nom}</td>   
                <td>{societe.assurance.nom}</td>
                <td className="py-3 px-4 text-sm font-medium text-gray-800">{societe.address}</td>
                <td className="py-3 px-4 text-sm text-gray-600 flex space-x-2">
                  <button onClick={() => openModal(societe)} className="text-blue-500 hover:text-blue-700">
                    <FaEdit />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modale d'ajout ou d'édition */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">{isEditing ? 'Modifier Société' : 'Ajouter Société'}</h3>

            {/* Formulaire */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Nom</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={currentSociete.nom}
                onChange={(e) => setCurrentSociete({ ...currentSociete, nom: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Assurance</label>
              <select className="w-full p-2 border rounded-md"
              value={currentSociete.assurance_id} // assurance_id, pas assurance
              onChange={(e) => setCurrentSociete({ ...currentSociete, assurance_id: e.target.value })} // assurance_id
            // onChange={handleAssuranceChange}
>
  <option defaultValue="">Sélectionner une assurance</option>
  {assurancesData && assurancesData.map((assurance) => (
    <option key={assurance.id} value={assurance.id} >
      {assurance.nom}
    </option>
   
  ))}
</select>

            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Adresse</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={currentSociete.address}
                onChange={(e) => setCurrentSociete({ ...currentSociete, address: e.target.value })}
              />
            </div>

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

export default Societes;
