import React, { useState, useEffect } from 'react';
import produitService from '../api/ApiProduit';
import ApiCategorie from '../api/ApiCategorie';
import { FaSearch, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const Produits = () => {
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [statsProduits, setStatsProduits] = useState({});


  const [page, setPage] = useState(0);
  const [size, setSize] = useState(2000);
  const [totalPages, setTotalPages] = useState(0);

  const defaultImage = '/images/produits-bg.jpg';

  const [currentProduit, setCurrentProduit] = useState({
    nomProduit: '',
    prixVente: '',
    stockInitiale: 0,
    stockReel: 0,
    alerte: 2,
    imageProduit: defaultImage,
    categorie: null,
    dateSaisie: new Date().toISOString(),
  });

  // 🔹 Charger les produits
  /*const loadProduits = async () => {
    try {
      const data = await produitService.getAllProduits();
      setProduits(data);
    } catch (error) {
      console.error('Erreur chargement produits :', error);
    }
  };*/
const loadProduits = async (pageNumber = 0) => {
  try {
    const data = await produitService.getAllPaged(pageNumber, size);
    setProduits(data.content);
    setTotalPages(data.totalPages);
    setPage(data.number);
  } catch (error) {
    console.error('Erreur chargement produits :', error);
  }
};

  // 🔹 Charger les catégories
  const loadCategories = async () => {
    try {
      const data = await ApiCategorie.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Erreur chargement catégories :', error);
    }
  };

  // 🔹 Charger stats produits
  const loadStatsProduits = async () => {
    try {
      const statsArray = await Promise.all(
        produits.map(async (p) => {
          const data = await produitService.getStats(p.id);
          return { [p.id]: data };
        })
      );
      const stats = Object.assign({}, ...statsArray);
      setStatsProduits(stats);
    } catch (err) {
      console.error('Erreur stats produits', err);
    }
  };

  useEffect(() => {
    loadProduits();
    loadCategories();
  }, []);

  useEffect(() => {
    if (produits.length > 0) loadStatsProduits();
  }, [produits]);

  // 🔹 Filtrage
  const filteredProduits = produits.filter(p =>
    p.nomProduit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔹 Format date
  const formatDateNiger = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('fr-FR', {
      timeZone: 'Africa/Niamey',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  // 🔹 Modal
  const openModal = (produit = null) => {
    if (produit) {
      setCurrentProduit({
        ...produit,
        stockReel: produit.stockReel || produit.stockInitiale,
        imageProduit: produit.imageProduit || defaultImage,
      });
      setIsEditing(true);
    } else {
      setCurrentProduit({
        nomProduit: '',
        prixVente: '',
        stockInitiale: 0,
        stockReel: 0,
        alerte: 2,
        imageProduit: defaultImage,
        categorie: null,
        dateSaisie: new Date().toISOString(),
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
    setMessage('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setMessage('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setCurrentProduit({ ...currentProduit, imageProduit: reader.result });
    };
    reader.readAsDataURL(file);
  };

const handlePageChange = (newPage) => {
  if (searchTerm.trim() === '') {
    loadProduits(newPage);
  } else {
    searchProduits(searchTerm, newPage);
  }
};

  // 🔹 Sauvegarde
  const handleSave = async () => {
    if (!currentProduit.nomProduit.trim()) {
      setMessage('❌ Le nom du produit est requis');
      return;
    }
    if (!currentProduit.prixVente || parseFloat(currentProduit.prixVente) <= 0) {
      setMessage('❌ Le prix de vente est obligatoire et doit être supérieur à 0');
      return;
    }
    if (!currentProduit.categorie) {
      setMessage('❌ La catégorie est obligatoire');
      return;
    }

    if (!isEditing && produits.some(p => p.nomProduit.toLowerCase() === currentProduit.nomProduit.toLowerCase())) {
      setMessage('❌ Ce produit existe déjà !');
      return;
    }

    const payload = {
      nomProduit: currentProduit.nomProduit,
      prixVente: parseFloat(currentProduit.prixVente),
      stockInitiale: parseInt(currentProduit.stockInitiale),
      alerte: parseInt(currentProduit.alerte),
      imageProduit: currentProduit.imageProduit || defaultImage,
      categorie: { id: currentProduit.categorie.id },
      dateSaisie: currentProduit.dateSaisie,
    };

    try {
      if (isEditing) {
        await produitService.updateProduit(currentProduit.id, payload);
        setMessage('✅ Produit modifié avec succès');
      } else {
        await produitService.addProduit(payload);
        setMessage('✅ Produit ajouté avec succès');
      }
      closeModal();
      loadProduits();
    } catch (error) {
      console.error('Erreur sauvegarde produit :', error);
      setMessage('❌ Erreur lors de la sauvegarde');
    }
  };

  // 🔹 Suppression
  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce produit ?')) return;
    try {
      await produitService.deleteProduit(id);
      setProduits(produits.filter(p => p.id !== id));
      setMessage('✅ Produit supprimé avec succès');
    } catch (error) {
      console.error('Erreur suppression produit :', error);
      setMessage('❌ Erreur lors de la suppression');
    }
  };
// Totaux globaux
// Totaux globaux
// Totaux globaux pour le footer
const totals = filteredProduits.reduce((acc, p) => {
  const stats = statsProduits[p.id] || {};
  const stockReel = p.stockReel ?? 0;
  const stockVendu = stats.stockVendu ?? 0;
  const beneficeReelle = stats.benefice ?? 0;
  const totalVenteReelle = stats.totalVente ?? 0;

  // --- Vente réelle et bénéfice réelle
  acc.venteReelle += totalVenteReelle;
  acc.beneficeReelle += beneficeReelle;

  // --- Vente estimée
  const venteParUnite = stockVendu > 0 ? totalVenteReelle / stockVendu : p.prixVente ?? 0;
  acc.venteEstimee += stockReel * venteParUnite;

  // --- Bénéfice estimée
  const beneficeParUnite = stockVendu > 0 ? beneficeReelle / stockVendu : 0;
  acc.beneficeEstimee += stockReel * beneficeParUnite;

  // --- Achat total (comme déjà calculé)
  if (p.entrees && p.entrees.length > 0) {
    acc.achatTotal += p.entrees.reduce((sum, e) => sum + (e.quantite * e.prixAchat), 0);
  }

  return acc;
}, {
  venteEstimee: 0,
  beneficeEstimee: 0,
  venteReelle: 0,
  beneficeReelle: 0,
  achatTotal: 0
});

useEffect(() => {
  const delayDebounce = setTimeout(() => {
    if (searchTerm.trim() === '') {
      loadProduits(0); // recharger la page normale si recherche vide
    } else {
      searchProduits(searchTerm, 0);
    }
  }, 500); // 500ms pour éviter trop d'appels API

  return () => clearTimeout(delayDebounce);
}, [searchTerm]);

const searchProduits = async (keyword, pageNumber = 0) => {
  try {
    const data = await produitService.searchProduits(keyword, pageNumber, size);
    setProduits(data.content);
    setTotalPages(data.totalPages);
    setPage(data.number);
  } catch (error) {
    console.error('Erreur recherche produits :', error);
  }
};

  return (
    <div className="max-w-7xl mx-auto p-6">
      {message && (
        <div className={`p-4 mb-4 rounded-md ${message.includes('✅') ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
          {message}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Produits</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Rechercher..."
            className="p-2 pl-10 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => openModal()}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <FaPlus /> <span>Ajouter produit</span>
          </button>
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Nom</th>
              <th className="p-3 text-left">Catégorie</th>
              <th className="p-3 text-left">Prix Vente</th>
              <th className="p-3 text-left">Stock Restant</th>
              <th className="p-3 text-left">Stock Vendu</th>
              <th className="p-3 text-left">Total Vente</th>
              <th className="p-3 text-left">Bénéfice</th>
              <th className="p-3 text-left">Alerte</th>
              <th className="p-3 text-left">Date Saisie</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProduits.length > 0 ? (
              filteredProduits.map((p) => {
                const stats = statsProduits[p.id] || {};
                return (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <img src={p.imageProduit || defaultImage} alt={p.nomProduit} className="w-10 h-10 rounded object-cover" />
                    </td>
                    <td className="p-3">{p.nomProduit}</td>
                    <td className="p-3">{p.categorie?.nomCategorie || '-'}</td>
                    <td className="p-3">{p.prixVente.toLocaleString()} FCFA</td>
                    <td className="p-3">{p.stockReel}</td>
                   <td className="p-3 bg-yellow-100 text-yellow-800 font-semibold text-center">
  {stats.stockVendu || 0}
</td>

                    <td className="p-3 font-semibold">{(stats.totalVente || 0).toLocaleString()} FCFA</td>
                    <td className="p-3 bg-blue-100 text-blue-800 font-bold text-right">
  {(stats.benefice || 0).toLocaleString()} FCFA
</td>

                    <td className={`p-3 ${p.stockReel <= p.alerte ? 'text-red-500 font-semibold' : ''}`}>{p.alerte}</td>
                    <td className="p-3">{formatDateNiger(p.dateSaisie)}</td>
                    <td className="p-3 flex space-x-2">
                      <button onClick={() => openModal(p)} className="text-blue-500 hover:text-blue-700"><FaEdit /></button>
                      
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="11" className="py-4 text-center text-gray-500">Aucun produit trouvé</td>
              </tr>
            )}
          </tbody>
<tfoot className="bg-gray-100 font-bold">
  <tr>
    <td colSpan={11} className="py-3 px-4">
      <div className="flex flex-wrap justify-between gap-2">
        <span className="bg-yellow-200 text-yellow-900 px-2 py-1 rounded">
          Vente estimée : {totals.venteEstimee.toLocaleString()} FCFA
        </span>
        <span className="bg-blue-200 text-blue-900 px-2 py-1 rounded">
          Bénéfice estimée : {totals.beneficeEstimee.toLocaleString()} FCFA
        </span>
        <span className="bg-green-200 text-green-900 px-2 py-1 rounded">
          Vente réelle : {totals.venteReelle.toLocaleString()} FCFA
        </span>
        <span className="bg-indigo-200 text-indigo-900 px-2 py-1 rounded">
          Bénéfice réelle : {totals.beneficeReelle.toLocaleString()} FCFA
        </span>
        
      </div>
    </td>
  </tr>
</tfoot>


        </table>


      </div>
<div className="flex justify-end mt-4 space-x-2">

  <button
    disabled={page === 0}
    onClick={() => handlePageChange(page - 1)}
    className={`px-4 py-2 rounded-md ${
      page === 0 ? 'bg-gray-300' : 'bg-blue-600 text-white'
    }`}
  >
    Précédent
  </button>

  <span className="px-4 py-2">
    Page {page + 1} / {totalPages}
  </span>

  <button
    disabled={page >= totalPages - 1}
    onClick={() => handlePageChange(page + 1)}
    className={`px-4 py-2 rounded-md ${
      page >= totalPages - 1 ? 'bg-gray-300' : 'bg-blue-600 text-white'
    }`}
  >
    Suivant
  </button>

</div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">{isEditing ? 'Modifier Produit' : 'Ajouter Produit'}</h3>

            <input
              type="text"
              placeholder="Nom du produit"
              value={currentProduit.nomProduit}
              onChange={(e) => setCurrentProduit({ ...currentProduit, nomProduit: e.target.value })}
              className="w-full p-2 mb-2 border rounded"
            />

            <input
              type="number"
              placeholder="Prix Vente"
              value={currentProduit.prixVente}
              onChange={(e) => setCurrentProduit({ ...currentProduit, prixVente: e.target.value })}
              className="w-full p-2 mb-2 border rounded"
            />

            <input
              type="number"
              placeholder="Stock Initiale"
              value={currentProduit.stockInitiale}
              onChange={(e) => setCurrentProduit({ ...currentProduit, stockInitiale: e.target.value })}
              className="w-full p-2 mb-2 border rounded"
            />

            <input
              type="number"
              placeholder="Alerte"
              value={currentProduit.alerte}
              onChange={(e) => setCurrentProduit({ ...currentProduit, alerte: e.target.value })}
              className="w-full p-2 mb-2 border rounded"
            />

            <select
              value={currentProduit.categorie?.id || ''}
              onChange={(e) =>
                setCurrentProduit({ ...currentProduit, categorie: categories.find(c => c.id === parseInt(e.target.value)) })
              }
              className="w-full p-2 mb-2 border rounded"
            >
              <option value="">Sélectionnez une catégorie</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.nomCategorie}</option>)}
            </select>

            <input type="file" onChange={handleImageChange} className="mb-2" />

            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={closeModal} className="px-4 py-2 bg-gray-400 text-white rounded">Annuler</button>
              <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded">
                {isEditing ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Produits;
