import React, { useEffect, useMemo, useState } from 'react';
import MesventeService from '../api/MesventeService';
import userService from '../api/ApiUser';
import recuService from '../api/ApiRecu';

const MesVentesTable = () => {
  const [ventes, setVentes] = useState([]);
  const [users, setUsers] = useState([]);

  const [clientFilter, setClientFilter] = useState('');
  const [debouncedClient, setDebouncedClient] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [pdfUrl, setPdfUrl] = useState('');
  const [showModal, setShowModal] = useState(false);

  /* ================= PAGINATION MOIS ================= */
  const [currentMonthPage, setCurrentMonthPage] = useState(0);
  const monthsPerPage = 3; // nombre de mois par page

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    fetchVentes();
    fetchUsers();
  }, []);

const fetchVentes = async () => {
  try {
<<<<<<< HEAD
    const res = await MesventeService.get({ page: 0, size: 1000 });
    
    
    // pagination
=======
    const res = await MesventeService.get({ page: 0, size: 50 }); // pagination
>>>>>>> a45223998defebbae8d29fde1e3be01e5f3c73f8
    const ventesArray = res.content; // ← ici !
    const sorted = ventesArray.sort(
      (a, b) => new Date(b.dateVente) - new Date(a.dateVente)
    );
    setVentes(sorted);
  } catch (e) {
    console.error(e);
  }
};

  const fetchUsers = async () => {
    try {
      const res = await userService.getAllUsers();
      setUsers(res);
    } catch (e) {
      console.error(e);
    }
  };

  /* ================= DEBOUNCE CLIENT ================= */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedClient(clientFilter), 400);
    return () => clearTimeout(t);
  }, [clientFilter]);

  /* ================= FILTER ================= */
  const filteredVentes = useMemo(() => {
    return ventes.filter(v => {
      const clientOk =
        !debouncedClient ||
        v.client?.nom?.toLowerCase().includes(debouncedClient.toLowerCase());

      const userOk = userFilter
        ? v.createdBy?.id === parseInt(userFilter)
        : true;

      const d = new Date(v.dateVente);
      const start = startDate ? new Date(startDate + 'T00:00:00') : null;
      const end = endDate ? new Date(endDate + 'T23:59:59') : null;

      const dateOk = (!start || d >= start) && (!end || d <= end);

      return clientOk && userOk && dateOk;
    });
  }, [ventes, debouncedClient, userFilter, startDate, endDate]);

  /* ================= GROUP BY MONTH ================= */
  const ventesParMois = useMemo(() => {
  const map = filteredVentes.reduce((acc, v) => {
    const date = new Date(v.dateVente);
    const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`; // 2026-02
    if (!acc[key]) acc[key] = { label: date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }), ventes: [] };
    acc[key].ventes.push(v);
    return acc;
  }, {});
  
  // Transformer en tableau et trier par mois descendant
  return Object.entries(map)
    .sort(([a], [b]) => new Date(b + '-01') - new Date(a + '-01'))  // ISO pour tri correct
    .map(([key, { label, ventes }]) => [label, ventes]);
}, [filteredVentes]);

  /* ================= PAGINATION DES MOIS ================= */
  const paginatedVentesParMois = useMemo(() => {
    const startIndex = currentMonthPage * monthsPerPage;
    return ventesParMois.slice(startIndex, startIndex + monthsPerPage);
  }, [ventesParMois, currentMonthPage]);

  /* ================= TOTALS ================= */
  const totalMois = list => ({
    vente: list.reduce((a, v) => a + (v.total || 0), 0),
    benefice: list.reduce((a, v) => a + Math.abs(v.benefice || 0), 0)
  });

  const totalGlobalVente = filteredVentes.reduce(
    (a, v) => a + (v.total || 0), 0
  );
  const totalGlobalBenefice = filteredVentes.reduce(
    (a, v) => a + Math.abs(v.benefice || 0), 0
  );

  /* ================= ACTIONS ================= */
  const handlePrint = async (codeTicket) => {
    const url = await recuService.getPdfTicket(codeTicket);
    setPdfUrl(url);
    setShowModal(true);
  };

  const handleAnnuler = async (vente) => {
    if (!window.confirm(`Annuler le ticket ${vente.codeTicket} ?`)) return;
    await MesventeService.deleteOne(vente.id);
    setVentes(prev => prev.filter(v => v.id !== vente.id));
  };

  /* ================= RENDER ================= */
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">📊 Mes Ventes</h2>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-2">
        <input
          className="input input-bordered"
          placeholder="Client"
          value={clientFilter}
          onChange={e => setClientFilter(e.target.value)}
        />
        <select
          className="input input-bordered"
          value={userFilter}
          onChange={e => setUserFilter(e.target.value)}
        >
          <option value="">Tous les vendeurs</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.nom}</option>
          ))}
        </select>
        <input type="date" className="input input-bordered"
          value={startDate} onChange={e => setStartDate(e.target.value)} />
        <input type="date" className="input input-bordered"
          value={endDate} onChange={e => setEndDate(e.target.value)} />
      </div>

      {/* MONTHS */}
      {paginatedVentesParMois.map(([mois, list]) => {
        const t = totalMois(list);
        return (
          <div key={mois} className="bg-white rounded shadow p-3">
            <h3 className="font-bold text-lg mb-2">📅 {mois.toUpperCase()}</h3>
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Client</th>
                  <th>Ticket</th>
                  <th>Montant</th>
                  <th>Bénéfice</th>
                  <th>Vendeur</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map(v => (
                  <tr key={v.id}>
                    <td>{new Date(v.dateVente).toLocaleDateString('fr-FR')}</td>
                    <td>{v.client?.nom}</td>
                    <td>{v.codeTicket}</td>
                    <td>{v.total.toLocaleString()} FCFA</td>
                    <td>{Math.abs(v.benefice).toLocaleString()} FCFA</td>
                    <td>{v.createdBy?.nom}</td>
                    <td>
                      <button className="btn btn-sm btn-primary mr-1"
                        onClick={() => handlePrint(v.codeTicket)}>PDF</button>
                      <button className="btn btn-sm btn-error"
                        onClick={() => handleAnnuler(v)}>Annuler</button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="font-bold">
                <tr>
                  <td colSpan="3">Total mois</td>
                  <td>{t.vente.toLocaleString()} FCFA</td>
                  <td>{t.benefice.toLocaleString()} FCFA</td>
                  <td colSpan="2"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        );
      })}

      {/* PAGINATION MOIS */}
      <div className="flex justify-between mt-4">
        <button
          className="btn btn-sm"
          onClick={() => setCurrentMonthPage(p => Math.max(p - 1, 0))}
          disabled={currentMonthPage === 0}
        >
          ◀ Mois précédent
        </button>

        <span>
          Page {currentMonthPage + 1} / {Math.ceil(ventesParMois.length / monthsPerPage)}
        </span>

        <button
          className="btn btn-sm"
          onClick={() => setCurrentMonthPage(p => Math.min(p + 1, Math.floor(ventesParMois.length / monthsPerPage)))}
          disabled={(currentMonthPage + 1) * monthsPerPage >= ventesParMois.length}
        >
          Mois suivant ▶
        </button>
      </div>

      {/* GLOBAL TOTAL */}
      <div className="bg-gray-200 p-3 rounded font-bold flex justify-between">
        <span>💰 Total ventes : {totalGlobalVente.toLocaleString()} FCFA</span>
        <span>📈 Bénéfice : {totalGlobalBenefice.toLocaleString()} FCFA</span>
      </div>

      {/* PDF MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-xl w-[40%] h-[80%]">
            <iframe src={pdfUrl} className="w-full h-full" />
            <button className="btn btn-primary mt-2"
              onClick={() => setShowModal(false)}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MesVentesTable;