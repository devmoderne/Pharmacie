import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import ApiEntreeStock from '../api/ApiEntreeStock';
import produitService from '../api/ApiProduit';
import FournisseurService from '../api/ApiFournisseur';

const EntreeStock = () => {
  const [entrees, setEntrees] = useState([]);
  const [produits, setProduits] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchProduit, setSearchProduit] = useState('');
  const [searchFournisseur, setSearchFournisseur] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [current, setCurrent] = useState({ quantite: '', produit: null, fournisseur: null, prixAchat: '', dateExpiration: '' });
  const [isEditing, setIsEditing] = useState(false);

  const [productSelected, setProductSelected] = useState(false);
  const [fournisseurSelected, setFournisseurSelected] = useState(false);
const [page, setPage] = useState(0);
const [size, setSize] = useState(2000);
const [totalPages, setTotalPages] = useState(0);

  // --- UTILITAIRES POUR FORMATAGE
  const formatNumber = (v) => (v ?? 0).toLocaleString();
  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "—");

const loadData = async (pageNumber = 0) => {
  try {
    const [pagedResult, prod, four] = await Promise.all([
      ApiEntreeStock.getAllPaged(pageNumber, size),
      produitService.getAllProduits(),
      FournisseurService.getAllFournisseurs()
    ]);

    setEntrees(pagedResult.content); // Page<EntreeStock> → content contient les données
    setTotalPages(pagedResult.totalPages);
    setProduits(prod);
    setFournisseurs(four);
    setPage(pageNumber);
  } catch (error) {
    console.error('Erreur chargement données :', error);
  }
};
const loadSearch = async (pageNumber = 0) => {
  try {
    const [pagedResult, prod, four] = await Promise.all([
      ApiEntreeStock.search(searchTerm || '', pageNumber, size),
      produitService.getAllProduits(),
      FournisseurService.getAllFournisseurs()
    ]);

    setEntrees(pagedResult.content);
    setTotalPages(pagedResult.totalPages);
    setProduits(prod);
    setFournisseurs(four);
    setPage(pageNumber);
  } catch (error) {
    console.error('Erreur search EntreeStock :', error);
  }
};
 
useEffect(() => {

  if (searchTerm.trim() === "") {
    loadData(page);
  } else {
    loadSearch(page);
  }

}, [searchTerm, page]);


  const openModal = (entree = null) => {
    setIsEditing(!!entree);
    setCurrent(entree || { quantite: '', produit: null, fournisseur: null, prixAchat: '', dateExpiration: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrent({ quantite: '', produit: null, fournisseur: null, prixAchat: '', dateExpiration: '' });
    setSearchProduit('');
    setSearchFournisseur('');
    setProductSelected(false);
    setFournisseurSelected(false);
  };
  const handleSearch = async (pageNumber = 0) => {
  try {
    const pagedResult = await ApiEntreeStock.search(searchTerm || '', pageNumber, size);
    setEntrees(pagedResult.content);
    setTotalPages(pagedResult.totalPages);
    setPage(pageNumber);
  } catch (error) {
    console.error("Erreur recherche :", error);
  }
};

  const handleSave = async () => {
    if (!current.produit || !current.fournisseur) {
      alert('Produit et fournisseur requis.');
      return;
    }
    try {
      if (isEditing) {
        const upd = await ApiEntreeStock.update(current.id, current);
        setEntrees(entrees.map(e => e.id === upd.id ? upd : e));
      } else {
        const add = await ApiEntreeStock.add(current);
        setEntrees([...entrees, add]);
      }
      closeModal();
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la sauvegarde.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cette entrée ?')) {
      try {
        await ApiEntreeStock.delete(id);
        setEntrees(entrees.filter(e => e.id !== id));
      } catch (error) {
        console.error(error);
        alert('Erreur suppression.');
      }
    }
  };

  const filtered = entrees.filter(e =>
    e.produit?.nomProduit?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const produitSuggestions = produits.filter(p =>
    p.nomProduit.toLowerCase().includes(searchProduit.toLowerCase())
  );

  const fournisseurSuggestions = fournisseurs.filter(f =>
    f.nom.toLowerCase().includes(searchFournisseur.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between mb-6 items-center">
        <h2 className="text-2xl font-bold">Entrées de stock</h2>
        <div className="flex space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher produit..."
              className="p-2 pl-8 border rounded-md"
              value={searchTerm}
             onChange={e => {
  setPage(0);
  setSearchTerm(e.target.value);
    handleSearch(0);
}}
            />
            <FaSearch className="absolute left-2 top-2.5 text-gray-400" />
          </div>
          <button
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            onClick={() => openModal()}
          >
            <FaPlus /><span className="ml-2">Ajouter</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left">Produit</th>
            <th className="py-3 px-4 text-left">Fournisseur</th>
            <th className="py-3 px-4 text-left">Quantité</th>
            <th className="py-3 px-4 text-left">Prix Achat</th>
            <th className="py-3 px-4 text-left">Total</th>
            <th className="py-3 px-4 text-left">Date Expiration</th>
            <th className="py-3 px-4 text-left">Date Entrée</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map(e => {
            const prix = e.prixAchat ?? 0;
            const qte = e.quantite ?? 0;
            const total = prix * qte;

            return (
              <tr key={e.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{e.produit?.nomProduit ?? "—"}</td>
                <td className="py-2 px-4">{e.fournisseur?.nom ?? "—"}</td>
                <td className="py-2 px-4">{qte}</td>
                <td className="py-2 px-4">{formatNumber(prix)} FCFA</td>
                <td className="py-2 px-4">{formatNumber(total)} FCFA</td>
                <td className="py-2 px-4">{formatDate(e.dateExpiration)}</td>
                <td className="py-2 px-4">{formatDate(e.dateEntree)}</td>
                <td className="py-2 px-4 flex space-x-2">
                  <button onClick={() => openModal(e)} className="text-blue-500 hover:text-blue-700"><FaEdit /></button>
                  <button onClick={() => handleDelete(e.id)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
                </td>
              </tr>
            );
          })}
        </tbody>

        <tfoot className="bg-gray-100 font-bold">
          <tr>
            <td colSpan={4} className="py-2 px-4 text-right">TOTAL GENERAL :</td>
            <td className="py-2 px-4">
              {formatNumber(
                filtered.reduce(
                  (sum, e) => sum + (e.prixAchat ?? 0) * (e.quantite ?? 0),
                  0
                )
              )} FCFA
            </td>
            <td colSpan={3}></td>
          </tr>
        </tfoot>
      </table>
<div className="flex justify-end mt-4 space-x-2">
  <button
    disabled={page <= 0}
    onClick={() => {
  if (searchTerm) {
    loadSearch(page - 1);
  } else {
    loadData(page - 1);
  }
}}
    className={`px-4 py-2 rounded-md ${page <= 0 ? 'bg-gray-300' : 'bg-blue-600 text-white'}`}
  >
    Précédent
  </button>

  <span className="px-4 py-2">
    Page {page + 1} / {totalPages}
  </span>

  <button
    disabled={page >= totalPages - 1}
    onClick={() => {
  if (searchTerm) {
    loadSearch(page + 1);
  } else {
    loadData(page + 1);
  }
}}
    className={`px-4 py-2 rounded-md ${page >= totalPages - 1 ? 'bg-gray-300' : 'bg-blue-600 text-white'}`}
  >
    Suivant
  </button>
</div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">
              {isEditing ? 'Modifier' : 'Ajouter'} une entrée
            </h3>

            {/* Autocomplete Produit */}
            <div className="mb-3 relative">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                className="w-full p-2 border rounded-md"
                value={searchProduit}
                onChange={e => {
                  const value = e.target.value;
                  setSearchProduit(value);
                  setProductSelected(false);
                  if (current.produit && value !== current.produit.nomProduit) {
                    setCurrent({ ...current, produit: null });
                  }
                }}
                onFocus={() => setProductSelected(false)}
              />
              {searchProduit && !productSelected && produitSuggestions.length > 0 && (
                <ul className="absolute z-10 border bg-white mt-1 w-full max-h-40 overflow-y-auto rounded-md shadow-md">
                  {produitSuggestions.map(p => (
                    <li
                      key={p.id}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        setCurrent({ ...current, produit: p });
                        setSearchProduit(p.nomProduit);
                        setProductSelected(true);
                      }}
                    >
                      {p.nomProduit} - {p.fournisseur?.nom ?? "—"}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Autocomplete Fournisseur */}
            <div className="mb-3 relative">
              <input
                type="text"
                placeholder="Rechercher un fournisseur..."
                className="w-full p-2 border rounded-md"
                value={searchFournisseur}
                onChange={e => {
                  const value = e.target.value;
                  setSearchFournisseur(value);
                  setFournisseurSelected(false);
                  if (current.fournisseur && value !== current.fournisseur.nom) {
                    setCurrent({ ...current, fournisseur: null });
                  }
                }}
                onFocus={() => setFournisseurSelected(false)}
              />
              {searchFournisseur && !fournisseurSelected && fournisseurSuggestions.length > 0 && (
                <ul className="absolute z-10 border bg-white mt-1 w-full max-h-40 overflow-y-auto rounded-md shadow-md">
                  {fournisseurSuggestions.map(f => (
                    <li
                      key={f.id}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        setCurrent({ ...current, fournisseur: f });
                        setSearchFournisseur(f.nom);
                        setFournisseurSelected(true);
                      }}
                    >
                      {f.nom}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Quantité */}
            <input
              type="number"
              placeholder="Quantité"
              className="w-full p-2 border rounded-md mb-2"
              value={current.quantite ?? ''}
              onChange={e => setCurrent({ ...current, quantite: parseInt(e.target.value) })}
            />

            {/* Prix Achat */}
            <input
              type="number"
              placeholder="Prix Achat"
              className="w-full p-2 border rounded-md mb-2"
              value={current.prixAchat ?? ''}
              onChange={e => setCurrent({ ...current, prixAchat: parseFloat(e.target.value) })}
            />

            {/* Date Expiration */}
            <input
              type="date"
              className="w-full p-2 border rounded-md mb-4"
              value={current.dateExpiration ?? ''}
              onChange={e => setCurrent({ ...current, dateExpiration: e.target.value })}
            />

            <div className="flex justify-end space-x-4">
              <button onClick={closeModal} className="bg-gray-400 text-white px-4 py-2 rounded-md">Annuler</button>
              <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded-md">
                {isEditing ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntreeStock;
