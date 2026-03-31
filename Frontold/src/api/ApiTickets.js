import axiosInstance from './axiosInstance';

const API_URL = '/ticket';

class VenteService {
// Récupérer tous les tickets
static async getAllTickets() {
try {
const response = await axiosInstance.get(`${API_URL}/all`);
if (response.status === 200) return response.data;
throw new Error('Erreur lors de la récupération des tickets');
} catch (error) {
console.error("Erreur getAllTickets :", error);
throw error;
}
}


static async getAllTicketpagened(page = 0, size = 10) {
  try {
    //const response = await axiosInstance.get(`${API_URL}`);
      const response = await axiosInstance.get(`${API_URL}?page=${page}&size=${size}`)
    if (response.status === 200) return response.data;
    throw new Error('Erreur lors de la récupération des tickets');
  } catch (error) {
    console.error("Erreur getAllTickets :", error);
    throw error;
  }
}




// Récupérer un ticket par code
static async getTicketByCode(code) {
try {
const response = await axiosInstance.get(`${API_URL}/find/${code}`);
if (response.status === 200) return response.data;
throw new Error('Erreur lors de la récupération du ticket');
} catch (error) {
console.error("Erreur getTicketByCode :", error);
throw error;
}
}

// Mettre à jour un ticket
static async updateTicket(id, ticketData) {
try {
const response = await axiosInstance.put(`${API_URL}/update/${id}`, ticketData);
if (response.status === 200) return response.data;
throw new Error('Erreur lors de la mise à jour du ticket');
} catch (error) {
console.error("Erreur updateTicket :", error);
throw error;
}
}

// Supprimer un ticket
static async deleteTicket(id) {
try {
const response = await axiosInstance.delete(`${API_URL}/delete/${id}`);
if (response.status === 200) return response.data;
throw new Error('Erreur lors de la suppression du ticket');
} catch (error) {
console.error("Erreur deleteTicket :", error);
throw error;
}
}


// Créer une vente
static async createVente(venteData) {
try {
const response = await axiosInstance.post(`${API_URL}/create`, venteData);
if (response.status === 201) return response.data;
throw new Error('Erreur lors de la création de la vente');
} catch (error) {
console.error("Erreur createVente :", error);
throw error;
}
}
}

export default VenteService;
