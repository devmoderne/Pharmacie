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
  const moisPerPage = 1; // 1 mois par page

  useEffect(() => {
    fetchVentes();
    fetchUsers();
  }, []);

  const fetchVentes = async () => {
    try {
      const res = await MesventeService.get({ page: 0, size: 10000 });
        console.log("🔥 Ventes reçues du backend :", res.content);
        console.log(
  "🔥 Ventes novembre et décembre :",
  res.content.filter(v => {
    const m = new Date(v.dateVente).getMonth() + 1;
    return m === 11 || m === 12;
  })
);
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

  useEffect(() => {
    const t = setTimeout(() => setDebouncedClient(clientFilter), 400);
    return () => clearTimeout(t);
  }, [clientFilter]);

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

  // GROUPER PAR MOIS
  const groupedByMonth = useMemo(() => {
    const map = filteredVentes.reduce((acc, v) => {
      const date = new Date(v.dateVente);
      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}`;

      if (!acc[key]) {
        acc[key] = {
          label: new Intl.DateTimeFormat('fr-FR', {
            month: 'long',
            year: 'numeric'
          }).format(date),
          ventes: []
        };
      }

      acc[key].ventes.push(v);
      return acc;
    }, {});

    return Object.values(map).sort(
      (a, b) =>
        new Date(b.ventes[0].dateVente) -
        new Date(a.ventes[0].dateVente)
    );
  }, [filteredVentes]);

  // PAGINATION PAR MOIS
  const paginatedMonths = useMemo(() => {
    const start = currentPage * moisPerPage;
    const end = start + moisPerPage;
    return groupedByMonth.slice(start, end);
  }, [groupedByMonth, currentPage]);

  const totalMois = list => ({
    vente: list.reduce((a, v) => a + (v.total || 0), 0),
    benefice: list.reduce((a, v) => a + Math.abs(v.benefice || 0), 0)
  });

  const handlePrint = async codeTicket => {
    const url = await recuService.getPdfTicket(codeTicket);
    setPdfUrl(url);
    setShowModal(true);
  };

  const handleAnnuler = async vente => {
    if (!window.confirm(`Annuler le ticket ${vente.codeTicket} ?`)) return;
    await MesventeService.deleteOne(vente.id);
    setVentes(prev => prev.filter(v => v.id !== vente.id));
  };
  const totalAnnee = useMemo(() => {
  return {
    vente: filteredVentes.reduce((a, v) => a + (v.total || 0), 0),
    benefice: filteredVentes.reduce(
      (a, v) => a + Math.abs(v.benefice || 0),
      0
    )
  };
}, [filteredVentes]);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">📊 Mes Ventes</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex justify-between font-bold text-lg">
  <span>
    💰 Total ventes : {totalAnnee.vente.toLocaleString()} FCFA
  </span>

  <span>
    📈 Bénéfice : {totalAnnee.benefice.toLocaleString()} FCFA
  </span>
</div>

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
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />

        <input type="date" className="input input-bordered"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
        />
      </div>

      {/* TABLE */}
      {paginatedMonths.map((monthData, index) => {
        const t = totalMois(monthData.ventes);

        return (
          <div key={index} className="bg-white rounded shadow p-3">
            <h3 className="font-bold text-lg mb-2">
              📅 {monthData.label.toUpperCase()}
            </h3>

            <div className="mb-2 font-bold">
              Total mois : {t.vente.toLocaleString()} FCFA |
              Bénéfice : {t.benefice.toLocaleString()} FCFA
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
                {monthData.ventes.map(v => (
                  <tr key={v.id}>
                    <td>{new Date(v.dateVente).toLocaleDateString('fr-FR')}</td>
                    <td>{v.client?.nom}</td>
                    <td>{v.codeTicket}</td>
                    <td>{v.total.toLocaleString()} FCFA</td>
                    <td>{Math.abs(v.benefice).toLocaleString()} FCFA</td>
                    <td>{v.createdBy?.nom}</td>
                    <td>
                      <button className="btn btn-sm btn-primary mr-1"
                        onClick={() => handlePrint(v.codeTicket)}>
                        PDF
                      </button>

                      <button className="btn btn-sm btn-error"
                        onClick={() => handleAnnuler(v)}>
                        Annuler
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}

      {/* PAGINATION */}
      <div className="flex justify-between mt-4">
        <button
          className="btn btn-sm"
          onClick={() => setCurrentPage(p => Math.max(p - 1, 0))}
          disabled={currentPage === 0}
        >
          ◀ Précédent
        </button>

        <span>
          Page {currentPage + 1} / {Math.ceil(groupedByMonth.length / moisPerPage)}
        </span>

        <button
          className="btn btn-sm"
          onClick={() =>
            setCurrentPage(p =>
              Math.min(
                p + 1,
                Math.ceil(groupedByMonth.length / moisPerPage) - 1
              )
            )
          }
          disabled={
            currentPage >=
            Math.ceil(groupedByMonth.length / moisPerPage) - 1
          }
        >
          Suivant ▶
        </button>
      </div>
    </div>
  );
};

export default MesVentesTable;