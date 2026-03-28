import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import clientService from '../api/ApiClient';
import produitService from '../api/ApiProduit';
import detailsVenteService from '../api/ApiDetails';
import ticketService from '../api/ApiCompteurticket';
import VenteService from '../api/ApiTickets';
import ApiEntreeStock from '../api/ApiEntreeStock';
import recuService from '../api/ApiRecu';

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
  const [venteCree, setVenteCree] = useState(false);

  // Montants calculés
  const [total, setTotal] = useState(0);
  const [netAPayer, setNetAPayer] = useState(0);
  const [rendu, setRendu] = useState(0);

  // PDF
  const [pdfUrl, setPdfUrl] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Charger clients et produits
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

  // Générer un code ticket dès qu’un client est choisi
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

  // Créer la vente
  useEffect(() => {
    const createVente = async () => {
      if (selectedClient && ticketCode && !venteCree) {
        try {
          const venteObj = {
            codeTicket: ticketCode,
            clientId: selectedClient.id,
            dateVente: new Date().toISOString(),
          };
          await VenteService.createVente(venteObj);
          setVenteCree(true);
          console.log(`✅ Vente créée pour le ticket ${ticketCode}`);
        } catch (error) {
          console.error("Erreur lors de la création de la vente :", error);
        }
      }
    };
    createVente();
  }, [selectedClient, ticketCode, venteCree]);

 /* // Calcul automatique des montants
  useEffect(() => {
    const totalCalc = listeLignes.reduce((acc, l) => acc + l.montant, 0);
    const montantRemise = totalCalc * (remise / 100);
    const montantTVA = totalCalc * (tva / 100);
    const net = totalCalc + montantTVA - montantRemise;
    const reste = remis > 0 ? remis - net : 0;

    setTotal(totalCalc);
    setNetAPayer(net);
    setRendu(reste > 0 ? reste : 0);
  }, [listeLignes, remise, tva, remis]);
*/// Calcul automatique des montants pour aperçu
useEffect(() => {
  // Total brut des lignes
  const totalLignes = listeLignes.reduce((acc, l) => acc + l.montant, 0);

  // Montant de la remise (en % du total brut)
  const montantRemise = (remise / 100) * totalLignes;

  // Total après remise
  const totalApresRemise = totalLignes - montantRemise;

  // Montant de la TVA (appliquée sur total après remise)
  const montantTVA = (tva / 100) * totalApresRemise;

  // Net à payer
  const net = totalApresRemise + montantTVA;

  // Rendu si le client a remis de l'argent
  const reste = remis > 0 ? remis - net : 0;

  // Mise à jour des états pour affichage
  setTotal(totalLignes);
  setNetAPayer(net);
  setRendu(reste > 0 ? reste : 0);
}, [listeLignes, remise, tva, remis]);

  // Filtrage client
  useEffect(() => {
    if (!searchClient) return setFilteredClients([]);
    const results = clientsData.filter(c =>
      c.nom.toLowerCase().includes(searchClient.toLowerCase())
    );
    setFilteredClients(results);
  }, [searchClient, clientsData]);

  // Filtrage produit
  useEffect(() => {
    if (!searchProduit) return setFilteredProduits([]);
    const results = produitsData.filter(p =>
      p.nomProduit.toLowerCase().includes(searchProduit.toLowerCase())
    );
    setFilteredProduits(results);
  }, [searchProduit, produitsData]);

  // Ajouter une ligne
  const handleAddLigne = async () => {
    if (!selectedProduit || !quantite || quantite <= 0) return;

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
      setListeLignes(prev => [
        ...prev,
        {
          id: savedDetail.id,
          produit: selectedProduit,
          quantite,
          prixVente,
          montant: quantite * prixVente,
          codeTicket: ticketCode,
          clientId: selectedClient.id
        }
      ]);

      setSelectedProduit(null);
      setQuantite(1);
      setPrixVente(0);
    } catch (error) {
      console.error("Erreur ajout ligne :", error);
      alert("⚠️ Une erreur est survenue lors de l’ajout du produit.");
    }
  };

  // Supprimer une ligne
  const handleDeleteLigne = async (produitId, codeTicket) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette ligne ?')) return;

    try {
      await detailsVenteService.deleteDetailsTicketByProduit(produitId, codeTicket);
      setListeLignes(prev => prev.filter(l => l.produit.id !== produitId));
    } catch (error) {
      console.error("Erreur suppression :", error);
      alert("❌ Erreur lors de la suppression.");
    }
  };

  // Finaliser ticket + afficher PDF
  const handleGenerateTicket = async () => {
    try {
      await detailsVenteService.finaliserTicket(ticketCode, tva, remise, remis, netAPayer);
      alert(`✅ Ticket ${ticketCode} finalisé avec succès !`);

      // 🔹 Génération et affichage du PDF
      const pdfUrl = await recuService.getPdfTicket(ticketCode);
      if (pdfUrl) {
        setPdfUrl(pdfUrl);
        setShowModal(true);
      } else {
        alert("❌ PDF introuvable ou erreur backend, le ticket a été finalisé sans PDF.");
      }

      // 🔹 Réinitialiser les valeurs
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
      setVenteCree(false);
    } catch (error) {
      console.error("Erreur finalisation :", error);
      alert("❌ Une erreur est survenue lors de la finalisation du ticket.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Gauche */}
      <div className="md:col-span-2 bg-white rounded-2xl p-4 shadow">
        {ticketCode && (
          <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-300 text-blue-700 text-center font-semibold shadow-sm">
            🧾 Code Ticket : {ticketCode}
          </div>
        )}

        {/* Sélection client */}
        <input
          type="text"
          placeholder="Rechercher un client..."
          value={searchClient}
          onChange={e => !selectedClient && setSearchClient(e.target.value)}
          readOnly={!!selectedClient}
          className={`border p-2 rounded w-full mb-2 ${selectedClient ? 'bg-gray-100' : ''}`}
        />

        {filteredClients.length > 0 && !selectedClient && (
          <div className="absolute bg-white border w-full max-h-48 overflow-y-auto z-50">
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

        {/* Produits */}
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={searchProduit}
          onChange={e => setSearchProduit(e.target.value)}
          disabled={!selectedClient}
          className={`border p-2 rounded w-full mb-2 ${!selectedClient ? 'bg-gray-100' : ''}`}
        />

        {filteredProduits.length > 0 && selectedClient && (
          <div className="absolute bg-white border w-full max-h-48 overflow-y-auto z-50">
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

        {selectedProduit && (
          <div className="flex space-x-2 mb-4">
            <input
              type="number"
              placeholder="Prix vente"
              value={prixVente}
              onChange={e => setPrixVente(Number(e.target.value))}
              className="border p-2 rounded w-1/3"
            />
            <input
              type="number"
              placeholder="Quantité"
              value={quantite}
              onChange={e => setQuantite(Number(e.target.value))}
              className="border p-2 rounded w-1/3"
            />
            <button
              onClick={handleAddLigne}
              className="px-4 rounded w-1/3 bg-blue-600 text-white hover:bg-blue-700"
            >
              <FaPlus className="inline mr-1" /> Ajouter
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
              <tr key={idx} className="hover:bg-gray-50">
                <td className="p-2">{l.produit.nomProduit}</td>
                <td className="p-2">{l.prixVente.toLocaleString()}</td>
                <td className="p-2">{l.quantite}</td>
                <td className="p-2 font-semibold text-blue-700">{l.montant.toLocaleString()} Fcfa</td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => handleDeleteLigne(l.produit.id, l.codeTicket)}
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

      {/* Droite : Récapitulatif */}
      <div className="bg-gray-50 p-4 rounded-2xl shadow space-y-3">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Récapitulatif</h3>
        <p>Total : <span className="font-bold text-gray-800">{total.toLocaleString()} Fcfa</span></p>
 <p>
  TVA :
  <select
    value={tva}
    onChange={e => setTva(Number(e.target.value))}
    className="border ml-2 p-1 rounded bg-gray-100 cursor-not-allowed"
    disabled
  >
    <option value={0}>0%</option>
  </select>
</p>


<p>
  Réduction :
  <select value={remise} onChange={e => setRemise(Number(e.target.value))} className="border ml-2 p-1 rounded">
    {Array.from({ length: 101 }, (_, i) => (
      <option key={i} value={i}>{i}%</option>
    ))}
  </select>
</p>
        <p>Net à payer : <span className="font-bold text-blue-600">{netAPayer.toFixed(2)} Fcfa</span></p>
        <p>
          Remis :
          <input type="number" value={remis} onChange={e => setRemis(Number(e.target.value))} className="border ml-2 p-1 w-24 rounded" /> Fcfa
        </p>
        <p>Rendu : <span className="font-bold text-green-600">{rendu.toFixed(2)} Fcfa</span></p>

        <button
          onClick={handleGenerateTicket}
          disabled={!selectedClient || listeLignes.length === 0}
          className={`w-full mt-4 py-2 rounded ${selectedClient && listeLignes.length > 0 ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
        >
          Générer Ticket
        </button>

        {/* Modal PDF */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-6 relative">
              <h2 className="text-2xl font-semibold mb-4 text-center">Aperçu du Ticket PDF</h2>
              <iframe src={pdfUrl} title="Aperçu PDF" className="w-full h-[70vh] border rounded"></iframe>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Detailstickets;
