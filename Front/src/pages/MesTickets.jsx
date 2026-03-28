import React, { useEffect, useState } from 'react';
import ApiTickets from '../api/apitickets';
import axiosInstance from '../api/axiosInstance';

const MesTickets = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination (⚠️ Spring commence à 0)
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // Filtres UI (optionnels, visuels)
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Annulation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [motif, setMotif] = useState('');

  // PDF
  const [showModal, setShowModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');

  // Rôle
  const [isAdmin, setIsAdmin] = useState(false);

  /* =========================
      CHECK ROLE
     ========================= */
  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        const roles = Array.isArray(user.roles) ? user.roles : [user.roles];
        setIsAdmin(roles.includes('ADMIN'));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  /* =========================
      FETCH PAGINÉ
     ========================= */
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const pageData = await ApiTickets.getAllTicketpagened(
        currentPage,
        pageSize
      );

      setData(pageData.content);
      setTotalPages(pageData.totalPages);

    } catch (error) {
      console.error("Erreur chargement tickets :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [currentPage]);

  /* =========================
      ACTIONS
     ========================= */
  const handleCancelClick = (ticket) => {
    if (isAdmin) {
      setSelectedTicket(ticket);
      setIsModalOpen(true);
    }
  };

  const handleConfirmCancel = async () => {
    if (!motif.trim()) {
      alert("Motif obligatoire");
      return;
    }

    try {
      await ApiTickets.cancelTicket(selectedTicket.numeroTicket, motif);
      setIsModalOpen(false);
      fetchTickets();
    } catch (error) {
      alert("Erreur annulation");
    }
  };

  const handlePrintClick = async (numeroTicket) => {
    try {
      const response = await axiosInstance.get(`/pdf/${numeroTicket}`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      setPdfUrl(URL.createObjectURL(blob));
      setShowModal(true);

    } catch (error) {
      alert("Erreur PDF");
    }
  };

  /* =========================
      RENDER
     ========================= */
  return (
    <div className="p-4 space-y-4">

      <h2 className="text-2xl font-bold">Liste des Tickets</h2>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Date</th>
              <th>Numéro</th>
              <th>Patient</th>
              <th>Assurance</th>
              <th>Patient</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center">Chargement...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-gray-500">
                  Aucun ticket
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr key={idx}>
                  <td>{new Date(item.date).toLocaleDateString('fr-FR')}</td>
                  <td>{item.numeroTicket}</td>
                  <td>{item.patientName}</td>
                  <td>{item.partAssurance.toLocaleString()} FCFA</td>
                  <td>{item.partPatient.toLocaleString()} FCFA</td>
                  <td className="font-bold">{item.total.toLocaleString()} FCFA</td>
                  <td className="flex gap-2">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handlePrintClick(item.numeroTicket)}
                    >
                      Imprimer
                    </button>

                    {isAdmin && item.status === 'actif' && (
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => handleCancelClick(item)}
                      >
                        Annuler
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          className="btn btn-sm"
          disabled={currentPage === 0}
          onClick={() => setCurrentPage(p => p - 1)}
        >
          Précédent
        </button>

        <span>
          Page {currentPage + 1} / {totalPages}
        </span>

        <button
          className="btn btn-sm"
          disabled={currentPage >= totalPages - 1}
          onClick={() => setCurrentPage(p => p + 1)}
        >
          Suivant
        </button>
      </div>

      {/* MODAL ANNULATION */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold">Motif d'annulation</h3>
            <textarea
              className="textarea textarea-bordered w-full"
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
            />
            <div className="modal-action">
              <button className="btn" onClick={() => setIsModalOpen(false)}>
                Annuler
              </button>
              <button className="btn btn-error" onClick={handleConfirmCancel}>
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PDF */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-5xl">
            <embed src={pdfUrl} width="100%" height="600px" />
            <div className="modal-action">
              <button className="btn" onClick={() => setShowModal(false)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MesTickets;
