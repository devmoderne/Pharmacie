import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import clientService from '../api/ApiClient';
import produitService from '../api/ApiProduit';
import detailsVenteService from '../api/ApiDetails';
import ticketService from '../api/ApiCompteurticket';
import IframePrinter from './IframePrinter';

const Detailstickets = () => {
const [searchClient, setSearchClient] = useState('');
const [filteredClients, setFilteredClients] = useState([]);
const [selectedClient, setSelectedClient] = useState(null);

const [searchProduit, setSearchProduit] = useState('');
const [filteredProduits, setFilteredProduits] = useState([]);
const [selectedProduit, setSelectedProduit] = useState(null);

const [quantite, setQuantite] = useState(1);
const [prixVente, setPrixVente] = useState(0);
const [listeLignes, setListeLignes] = useState([]);

const [tva, setTva] = useState(0);
const [remise, setRemise] = useState(0);
const [remis, setRemis] = useState(0);

const [clientsData, setClientsData] = useState([]);
const [produitsData, setProduitsData] = useState([]);
const [ticketCode, setTicketCode] = useState(null);

// Pour afficher le reçu
const [showRecu, setShowRecu] = useState(false);
const [ticketRecu, setTicketRecu] = useState(null);

// 🔹 Charger clients et produits
useEffect(() => {
const loadData = async () => {
try {
const clients = await clientService.getAllClients();
const produits = await produitService.getAllProduits();
setClientsData(clients);
setProduitsData(produits);
} catch (error) {
console.error("Erreur de chargement :", error);
}
};
loadData();
}, []);

// 🔹 Génération du ticket dès qu’un client est choisi
useEffect(() => {
const fetchTicketCode = async () => {
if (selectedClient && !ticketCode) {
try {
const code = await ticketService.generateTk();
setTicketCode(code);
} catch (error) {
console.error("Erreur de génération du ticket :", error);
}
}
};
fetchTicketCode();
}, [selectedClient, ticketCode]);

// 🔹 Filtrage client
useEffect(() => {
if (!searchClient) return setFilteredClients([]);
const results = clientsData.filter(c =>
c.nom.toLowerCase().includes(searchClient.toLowerCase())
);
setFilteredClients(results);
}, [searchClient, clientsData]);

// 🔹 Filtrage produit
useEffect(() => {
if (!searchProduit) return setFilteredProduits([]);
const results = produitsData.filter(p =>
p.nomProduit.toLowerCase().includes(searchProduit.toLowerCase())
);
setFilteredProduits(results);
}, [searchProduit, produitsData]);

// 🔹 Ajouter ligne avec backend
const handleAddLigne = async () => {
if (!selectedProduit || !quantite || quantite <= 0) return;

```
const detailsObj = {
  quantite,
  prixUnitaire: prixVente,
  montant: quantite * prixVente,
  codeTicket: ticketCode,
  clientId: selectedClient.id,
  produit: { id: selectedProduit.id }
};

try {
  const savedDetail = await detailsVenteService.addDetailsTicket(detailsObj);

  setListeLignes([...listeLignes, {
    id: savedDetail.id,
    produit: selectedProduit,
    quantite,
    prixVente,
    montant: quantite * prixVente,
    codeTicket: ticketCode,
    clientId: selectedClient.id
  }]);

  setSelectedProduit(null);
  setQuantite(1);
  setPrixVente(0);
} catch (error) {
  console.error("Erreur ajout ligne :", error);
  alert("Une erreur est survenue. Veuillez réessayer.");
}
```

};

const handleDeleteLigne = (index) => {
const newList = [...listeLignes];
newList.splice(index, 1);
setListeLignes(newList);
};

// 🔹 Calculs
const total = listeLignes.reduce((acc, l) => acc + l.montant, 0);
const montantRemise = total * (remise / 100);
const montantTVA = total * (tva / 100);
const netAPayer = total + montantTVA - montantRemise;
const reste = remis > 0 ? remis - netAPayer : 0;
const rendu = reste > 0 ? reste : 0;

// 🔹 Finaliser ticket et générer reçu
const handleGenerateTicket = async () => {
try {
await detailsVenteService.finaliserTicket(ticketCode);


  // Préparer ticket pour le reçu
  const ticketData = {
    codeTicket: ticketCode,
    dateVente: new Date(),
    client: selectedClient,
    user: { nom: "Vendeur Exemple" },
    lignes: listeLignes,
    total,
    tva,
    remise,
    netAPayer,
    remis,
    rendu
  };

  setTicketRecu(ticketData);
  setShowRecu(true);

  // Réinitialiser la saisie
  setListeLignes([]);
  setSelectedClient(null);
  setSearchClient('');
  setSearchProduit('');
  setSelectedProduit(null);
  setQuantite(1);
  setPrixVente(0);
  setTva(0);
  setRemise(0);
  setRemis(0);
  setTicketCode(null);

  alert(`✅ Ticket ${ticketCode} finalisé avec succès !`);

} catch (error) {
  console.error("Erreur finalisation :", error);
  alert("❌ Une erreur est survenue lors de la finalisation du ticket.");
}


};

return ( <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
{/* Partie gauche : Détails vente */} <div className="md:col-span-2 bg-white rounded-2xl p-4 shadow">
{ticketCode && ( <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-300 text-blue-700 text-center font-semibold shadow-sm"> <span className="text-gray-600 mr-2">🧾 Code Ticket :</span> {ticketCode} </div>
)}


    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Détails de la vente</h2>

    {/* Recherche client */}
    <div className="relative mb-4">
      <input
        type="text"
        placeholder="Rechercher un client..."
        value={searchClient}
        onChange={e => !selectedClient && setSearchClient(e.target.value)}
        readOnly={!!selectedClient}
        className={`border p-2 rounded w-full ${selectedClient ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      />
      {filteredClients.length > 0 && !selectedClient && (
        <div className="absolute bg-white border w-full mt-1 max-h-48 overflow-y-auto z-50">
          {filteredClients.map(c => (
            <div
              key={c.id}
              onClick={() => {
                setSelectedClient(c);
                setSearchClient(c.nom);
                setFilteredClients([]);
              }}
              className="p-2 hover:bg-gray-200 cursor-pointer"
            >
              {c.nom} ({c.telephone})
            </div>
          ))}
        </div>
      )}
    </div>

    {selectedClient && (
      <div className="p-3 bg-gray-100 rounded mb-4 shadow-inner">
        <p><strong>Client :</strong> {selectedClient.nom}</p>
        <p><strong>Téléphone :</strong> {selectedClient.telephone}</p>
      </div>
    )}

    {/* Recherche produit */}
    <div className="relative mb-2">
      <input
        type="text"
        placeholder="Rechercher un produit..."
        value={searchProduit}
        onChange={e => setSearchProduit(e.target.value)}
        disabled={!selectedClient}
        className={`border p-2 rounded w-full ${!selectedClient ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      />
      {filteredProduits.length > 0 && selectedClient && (
        <div className="absolute bg-white border w-full mt-1 max-h-48 overflow-y-auto z-50">
          {filteredProduits.map(p => (
            <div
              key={p.id}
              onClick={() => {
                setSelectedProduit(p);
                setPrixVente(p.prixVente);
                setSearchProduit('');
                setFilteredProduits([]);
              }}
              className="p-2 hover:bg-gray-200 cursor-pointer"
            >
              {p.nomProduit}
            </div>
          ))}
        </div>
      )}
    </div>

    {selectedProduit && (
      <div className="flex space-x-2 mb-4">
        <input
          type="number"
          placeholder="Prix vente"
          value={prixVente}
          onChange={e => setPrixVente(Number(e.target.value))}
          className="border p-2 rounded w-1/3"
          disabled={!selectedClient}
        />
        <input
          type="number"
          placeholder="Quantité"
          value={quantite}
          onChange={e => setQuantite(Number(e.target.value))}
          className="border p-2 rounded w-1/3"
          disabled={!selectedClient}
        />
        <button
          onClick={handleAddLigne}
          className={`px-4 rounded w-1/3 ${selectedClient ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
          disabled={!selectedClient}
        >
          Ajouter
        </button>
      </div>
    )}

    {/* Tableau produits */}
    <table className="min-w-full text-sm border">
      <thead className="bg-gray-200 text-gray-700">
        <tr>
          <th className="border p-2">Produit</th>
          <th className="border p-2">PU</th>
          <th className="border p-2">Qté</th>
          <th className="border p-2">Montant</th>
          <th className="border p-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {listeLignes.map((l, idx) => (
          <tr key={idx} className="border-b hover:bg-gray-50">
            <td className="p-2">{l.produit.nomProduit}</td>
            <td className="p-2">{l.prixVente}</td>
            <td className="p-2">{l.quantite}</td>
            <td className="p-2">{l.montant}</td>
            <td className="p-2 text-center">
              <button
                onClick={() => handleDeleteLigne(idx)}
                className="text-red-600 hover:text-red-800"
              >
                <FaTrash />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Partie droite : Récapitulatif */}
  <div className="bg-gray-50 p-4 rounded-2xl shadow space-y-4">
    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Récapitulatif</h3>

    <div className="space-y-2 text-gray-700">
      <p>Total: <span className="font-bold">{total.toLocaleString()} Fcfa</span></p>
      <p>
        TVA :
        <select
          value={tva}
          onChange={e => setTva(Number(e.target.value))}
          disabled={!selectedClient}
          className="border ml-2 p-1 rounded"
        >
          {Array.from({ length: 21 }, (_, i) => (
            <option key={i} value={i}>{i}%</option>
          ))}
        </select>
      </p>
      <p>
        Remise :
        <input
          type="number"
          value={remise}
          onChange={e => setRemise(Number(e.target.value))}
          disabled={!selectedClient}
          className="border ml-2 p-1 w-16 rounded"
        />%
      </p>
      <p>Net à payer : <span className="font-bold text-blue-600">{netAPayer.toFixed(2)} Fcfa</span></p>
      <p>
        Remis :
        <input
          type="number"
          value={remis}
          onChange={e => setRemis(Number(e.target.value))}
          disabled={!selectedClient}
          className="border ml-2 p-1 w-24 rounded"
        /> Fcfa
      </p>
      <p>Rendue : <span className="font-bold text-green-600">{rendu.toFixed(2)} Fcfa</span></p>
    </div>

    <button
      onClick={handleGenerateTicket}
      disabled={!selectedClient || listeLignes.length === 0}
      className={`w-full mt-4 py-2 rounded ${selectedClient && listeLignes.length > 0 ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
    >
      Générer Ticket
    </button>
  </div>

  {/* 🔹 Affichage du reçu */}
  {showRecu && ticketRecu && (
    <IframePrinter
      ticket={ticketRecu}
      onClose={() => setShowRecu(false)}
    />
  )}
</div>


);
};

export default Detailstickets;
