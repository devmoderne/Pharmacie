import React, { useState, useEffect } from 'react';
import recuService from '../api/ApiRecuService';
import { FaPrint, FaTrash } from 'react-icons/fa';

const ListeTickets = () => {
const [tickets, setTickets] = useState([]);
const [search, setSearch] = useState('');
const [totalVentes, setTotalVentes] = useState(0);

// 🔹 Charger tous les tickets actifs
const loadTickets = async () => {
try {
const data = await recuService.getAllRecus();
setTickets(data);
} catch (error) {
console.error("Erreur chargement tickets :", error);
}
};

useEffect(() => {
loadTickets();
}, []);

// 🔹 Supprimer un ticket (logique)
const handleDelete = async (codeTicket) => {
if (!window.confirm("Voulez-vous vraiment supprimer ce ticket ?")) return;
try {
await recuService.deletePdfTicket(codeTicket);
setTickets(prev => prev.filter(t => t.codeTicket !== codeTicket));
} catch (error) {
console.error("Erreur suppression :", error);
alert("Erreur lors de la suppression du ticket");
}
};

// 🔹 Filtrer les tickets
const filteredTickets = tickets.filter(t =>
t.codeTicket.toLowerCase().includes(search.toLowerCase())
);

// 🔹 Calcul total des ventes
useEffect(() => {
const total = filteredTickets.reduce((acc, t) => acc + (t.montantTotal || 0), 0);
setTotalVentes(total);
}, [filteredTickets]);

// 🔹 Imprimer un ticket
const handlePrint = (codeTicket) => {
const url = `/api/tickets/${codeTicket}/pdf`;
window.open(url, '_blank');
};

return ( <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow"> <h2 className="text-2xl font-semibold mb-4 text-gray-700">Tickets sauvegardés</h2>


  <input
    type="text"
    placeholder="Filtrer par code ticket..."
    value={search}
    onChange={e => setSearch(e.target.value)}
    className="border p-2 rounded w-full mb-4"
  />

  <table className="min-w-full text-sm border">
    <thead className="bg-gray-200 text-gray-700">
      <tr>
        <th className="border p-2">Code Ticket</th>
        <th className="border p-2">Date</th>
        <th className="border p-2">Utilisateur</th>
        <th className="border p-2">Montant Total</th>
        <th className="border p-2">Actions</th>
      </tr>
    </thead>
    <tbody>
      {filteredTickets.map((t, idx) => (
        <tr key={idx} className="border-b hover:bg-gray-50">
          <td className="p-2">{t.codeTicket}</td>
          <td className="p-2">{new Date(t.dateCreation).toLocaleString()}</td>
          <td className="p-2">{t.user?.nom || 'N/A'}</td>
          <td className="p-2">{(t.montantTotal || 0).toLocaleString()} Fcfa</td>
          <td className="p-2 flex justify-center space-x-2">
            <button onClick={() => handlePrint(t.codeTicket)} className="text-blue-600 hover:text-blue-800">
              <FaPrint />
            </button>
            <button onClick={() => handleDelete(t.codeTicket)} className="text-red-600 hover:text-red-800">
              <FaTrash />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  <div className="mt-4 text-right font-bold text-gray-700">
    Total des ventes : {totalVentes.toLocaleString()} Fcfa
  </div>
</div>


);
};

export default ListeTickets;
