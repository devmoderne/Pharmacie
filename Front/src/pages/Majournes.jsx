import React, { useEffect, useState } from 'react';
import ApiTickets from '../api/apitickets';
import axiosInstance from '../api/axiosInstance';

const Majournees = () => {
const [data, setData] = useState([]);
const [search, setSearch] = useState('');
const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');
const [userRole, setUserRole] = useState([]);
const [isRoleLoaded, setIsRoleLoaded] = useState(false);
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedTicket, setSelectedTicket] = useState(null);
const [motif, setMotif] = useState('');
const [showModal, setShowModal] = useState(false);
const [pdfUrl, setPdfUrl] = useState('');
const [loading, setLoading] = useState(false);

useEffect(() => {
console.log("useEffect: récupération du user et des tickets...");
console.log("Contenu de localStorage user :", localStorage.getItem('user'));

const userString = localStorage.getItem('user');
if (userString) {
  try {
    const user = JSON.parse(userString);
    console.log("Utilisateur récupéré depuis localStorage :", user);
    if (user && user.roles) {
      const roles = Array.isArray(user.roles) ? user.roles : [user.roles];
      setUserRole(roles);
      setIsRoleLoaded(true);
      console.log("Rôles utilisateur :", roles);
    }
  } catch (error) {
    console.error("Erreur lors du parsing du user :", error);
  }
}

ApiTickets.getTicketsByUser()
  .then((tickets) => {
    console.log("Tickets récupérés :", tickets);
    setData(tickets);
  })
  .catch((error) => console.error("Erreur API : ", error));


}, []);

console.log("Données filtrées avant rendu :", data);

const filteredData = data.filter((item) => {
const matchesSearch =
item.patientName.toLowerCase().includes(search.toLowerCase()) ||
item.numeroTicket.toLowerCase().includes(search.toLowerCase());

const itemDate = new Date(item.date);
const start = startDate ? new Date(startDate) : null;
const end = endDate ? new Date(endDate) : null;

const matchesDate =
  (!start || itemDate >= start) && (!end || itemDate <= end);

return matchesSearch && matchesDate;


});

console.log("Données après filtre (search + date) :", filteredData);

const handleCancelClick = (ticket) => {
console.log("Annulation demandée pour le ticket :", ticket);
setSelectedTicket(ticket);
setIsModalOpen(true);
};

const handleConfirmCancel = async () => {
if (motif.trim() === '') {
alert('Veuillez saisir un motif pour annuler le ticket.');
return;
}


try {
  console.log("Envoi de l'annulation au serveur pour le ticket :", selectedTicket.numeroTicket);
  await ApiTickets.cancelTicket(selectedTicket.numeroTicket, motif);
  setData(data.filter(item => item.numeroTicket !== selectedTicket.numeroTicket));
  console.log("Ticket annulé, données mises à jour :", data);
  setIsModalOpen(false);
  alert('Ticket annulé avec succès');
} catch (error) {
  console.error("Erreur lors de l'annulation du ticket :", error);
  alert("Une erreur est survenue lors de l'annulation.");
}


};

const handlePrintClick = async (numeroTicket) => {
try {
console.log("Génération PDF pour le ticket :", numeroTicket);
setLoading(true);
const response = await axiosInstance.get(`/pdf/${numeroTicket}`, {
responseType: 'blob',
});

  const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
  const url = URL.createObjectURL(pdfBlob);
  setPdfUrl(url);
  setShowModal(true);
  console.log("PDF généré et URL créée :", url);
} catch (error) {
  console.error('Erreur lors de la génération du PDF :', error);
  alert('Impossible de générer le PDF.');
} finally {
  setLoading(false);
}


};

return ( <div className="p-4 space-y-4"> <h2 className="text-2xl font-bold">Liste des Journées</h2>

  <div className="flex flex-col md:flex-row md:items-center md:gap-4 space-y-2 md:space-y-0">
    <input
      type="text"
      placeholder="🔍 Rechercher..."
      className="input input-bordered w-full md:w-1/3"
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        console.log("Recherche modifiée :", e.target.value);
      }}
    />
    <input
      type="date"
      className="input input-bordered"
      value={startDate}
      onChange={(e) => {
        setStartDate(e.target.value);
        console.log("Date de début modifiée :", e.target.value);
      }}
    />
    <input
      type="date"
      className="input input-bordered"
      value={endDate}
      onChange={(e) => {
        setEndDate(e.target.value);
        console.log("Date de fin modifiée :", e.target.value);
      }}
    />
  </div>

  {/* ... le reste du code reste inchangé ... */}

</div>


);
};

export default Majournees;
