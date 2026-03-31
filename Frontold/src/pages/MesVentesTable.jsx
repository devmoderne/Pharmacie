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

  const [currentPage, setCurrentPage] = useState(0);
  const ventesPerPage = 20; // nombre de ventes par page

  useEffect(() => {
    fetchVentes();
    fetchUsers();
  }, []);

  const fetchVentes = async () => {
    try {
      const res = await MesventeService.get({ page: 0, size: 1000 });
      const sorted = res.content.sort(
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

  // Debounce client filter
  useEffect(() => {
    const t = setTimeout(() => setDebouncedClient(clientFilter), 400);
    return () => clearTimeout(t);
  }, [clientFilter]);

  // Filtrage des ventes
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

  // Totaux par mois
  const ventesParMois = useMemo(() => {
    const map = filteredVentes.reduce((acc, v) => {
      const date = new Date(v.dateVente);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!acc[key]) acc[key] = { label: new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(date), ventes: [] };
      acc[key].ventes.push(v);
      return acc;
    }, {});

    return Object.entries(map)
        .sort(([a], [b]) => new Date(b + '-01') - new Date(a + '-01')) // tri mois descendant
        .map(([key, value]) => [value.label, value.ventes]);
  }, [filteredVentes]);

  // Pagination par ventes
  const paginatedVentes = useMemo(() => {
    const start = currentPage * ventesPerPage;
    const end = start + ventesPerPage;
    return filteredVentes.slice(start, end);
  }, [filteredVentes, currentPage]);

  const totalMois = list => ({
    vente: list.reduce((a, v) => a + (v.total || 0), 0),
    benefice: list.reduce((a, v) => a + Math.abs(v.benefice || 0), 0)
  });

  const totalGlobalVente = filteredVentes.reduce((a, v) => a + (v.total || 0), 0);
  const totalGlobalBenefice = filteredVentes.reduce((a, v) => a + Math.abs(v.benefice || 0), 0);

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
          <input type="date" className="input input-bordered" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <input type="date" className="input input-bordered" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>

        {/* TABLE DES VENTES */}
        {ventesParMois.map(([mois, list]) => {
          const t = totalMois(list);
          return (
              <div key={mois} className="bg-white rounded shadow p-3">
                <h3 className="font-bold text-lg mb-2">📅 {mois.toUpperCase()}</h3>
                <div className="mb-2 font-bold">
                  Total mois : {t.vente.toLocaleString()} FCFA | Bénéfice : {t.benefice.toLocaleString()} FCFA
                </div>
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
                          <button className="btn btn-sm btn-primary mr-1" onClick={() => handlePrint(v.codeTicket)}>PDF</button>
                          <button className="btn btn-sm btn-error" onClick={() => handleAnnuler(v)}>Annuler</button>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          );
        })}

        {/* PAGINATION VENTES */}
        <div className="flex justify-between mt-4">
          <button
              className="btn btn-sm"
              onClick={() => setCurrentPage(p => Math.max(p - 1, 0))}
              disabled={currentPage === 0}
          >
            ◀ Précédent
          </button>

          <span>
          Page {currentPage + 1} / {Math.ceil(filteredVentes.length / ventesPerPage)}
        </span>

          <button
              className="btn btn-sm"
              onClick={() => setCurrentPage(p => Math.min(p + 1, Math.floor(filteredVentes.length / ventesPerPage)))}
              disabled={(currentPage + 1) * ventesPerPage >= filteredVentes.length}
          >
            Suivant ▶
          </button>
        </div>

        {/* TOTAL GLOBAL */}
        <div className="bg-gray-200 p-3 rounded font-bold flex justify-between">
          <span>💰 Total ventes : {totalGlobalVente.toLocaleString()} FCFA</span>
          <span>📈 Bénéfice : {totalGlobalBenefice.toLocaleString()} FCFA</span>
        </div>

        {/* PDF MODAL */}
        {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-4 rounded-xl w-[40%] h-[80%]">
                <iframe src={pdfUrl} className="w-full h-full" />
                <button className="btn btn-primary mt-2" onClick={() => setShowModal(false)}>Fermer</button>
              </div>
            </div>
        )}
      </div>
  );
};

export default MesVentesTable;