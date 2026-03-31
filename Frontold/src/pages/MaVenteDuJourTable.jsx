import React, { useEffect, useState } from 'react';
import MesventeService from '../api/MesventeService';
import recuService from '../api/ApiRecu';

const MaVenteDuJourTable = () => {
  const [ventes, setVentes] = useState([]);
  const [clientFilter, setClientFilter] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  // 🔹 Récupération du rôle
  const isUser = user?.roles.includes('USER'); 
  const isAdmin = user?.roles.includes('ADMIN'); 
  const userPhone = user?.username || '';

  const fetchVentesDuJour = async () => {
    try {
      setLoading(true);
      const userPhone = user?.username;
      if (!userPhone) return alert("Téléphone utilisateur manquant");
      const res = await MesventeService.getVentesDuJourByPhone(userPhone);

      const today = new Date();
      const ventesAujourdHui = res.filter(v => {
        const dateVente = new Date(v.dateVente);
        return dateVente.toDateString() === today.toDateString();
      });

      setVentes(ventesAujourdHui.sort((a, b) => new Date(b.dateVente) - new Date(a.dateVente)));
    } catch (err) {
      console.error('Erreur récupération ventes du jour :', err);
      alert("Impossible de récupérer les ventes du jour.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByClient = () => {
    fetchVentesDuJour();
  };

  const handlePrint = async (codeTicket) => {
    try {
      const url = await recuService.getPdfTicket(codeTicket);
      if (!url) return alert("Impossible de générer le PDF.");
      setPdfUrl(url);
      setShowModal(true);
    } catch (err) {
      console.error('Erreur génération PDF :', err);
      alert('Impossible de générer le PDF.');
    }
  };

  const handleAnnuler = async (vente) => {
    if (!window.confirm(`Voulez-vous vraiment annuler le ticket ${vente.codeTicket} ?`)) return;
    try {
      await MesventeService.deleteOne(vente.id);
      setVentes(prev => prev.filter(v => v.id !== vente.id));
    } catch (err) {
      console.error('Erreur annulation :', err);
      alert("Impossible d'annuler la vente.");
    }
  };

  const filteredVentes = ventes.filter(v =>
    v.client?.nom.toLowerCase().includes(clientFilter.toLowerCase())
  );

  const totalVisible = filteredVentes.reduce((acc, v) => acc + (v.total || 0), 0);

  const totalBenefice = filteredVentes.reduce((acc, v) => acc + Math.abs(v.benefice || 0), 0);

  useEffect(() => {
    fetchVentesDuJour();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Mes ventes du jour</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Nom du client..."
          className="input input-bordered"
          value={clientFilter}
          onChange={(e) => setClientFilter(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearchByClient}>Filtrer</button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            setClientFilter('');
            fetchVentesDuJour();
          }}
        >
          Réinitialiser
        </button>
      </div>

      {loading ? <p>Chargement des ventes...</p> : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Date et Heure</th>
                <th>Client</th>
                <th>Code Ticket</th>
                <th>Montant</th>

                {/* 🔥 BÉNÉFICE visible seulement ADMIN */}
                {isAdmin && <th>Bénéfice</th>}

               
                <th>Imprimer</th>
                <th>Annuler</th>
              </tr>
            </thead>
            <tbody>
              {filteredVentes.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-gray-500">Aucune vente trouvée</td>
                </tr>
              ) : filteredVentes.map((v) => (
                <tr key={v.id}>
                  <td>{new Date(v.dateVente).toLocaleString('fr-FR')}</td>
                  <td>{v.client?.nom || '-'}</td>
                  <td>{v.codeTicket}</td>
                  <td>{(v.total || 0).toLocaleString()} FCFA</td>

                  {/* 🔥 Valeur bénéfice seulement ADMIN */}
                  {isAdmin && (
                    <td>{Math.abs(v.benefice || 0).toLocaleString()} FCFA</td>
                  )}

                  <td>
                    <button className="btn btn-sm btn-primary" onClick={() => handlePrint(v.codeTicket)}>
                      Imprimer
                    </button>
                  </td>
                  {isAdmin && ( <td>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleAnnuler(v)}
                     
                      title={isUser ? "Vous n'avez pas la permission" : ""}
                    >
                      Annuler
                    </button>
                  </td> )}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold">
                <td colSpan="3">Total du jour :</td>
                <td>{totalVisible.toLocaleString()} FCFA</td>

                {/* 🔥 Total bénéfice seulement ADMIN */}
                {isAdmin && (
                  <td>{totalBenefice.toLocaleString()} FCFA</td>
                )}

                <td colSpan="3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-4 max-w-3xl w-full">
            <iframe src={pdfUrl} className="w-full h-[70vh]" title="Aperçu PDF"></iframe>
            <div className="flex justify-end mt-2">
              <button className="btn btn-primary" onClick={() => setShowModal(false)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaVenteDuJourTable;
