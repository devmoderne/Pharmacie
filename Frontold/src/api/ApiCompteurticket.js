import axiosInstance from './axiosInstance';

// ✅ Fonction pour générer un nouveau code ticket depuis le backend
const generateTk = async () => {
  try {
    const response = await axiosInstance.get('/compteurticket');
    return response.data.codeTicket; // correspond à ton backend
  } catch (error) {
    console.error("Erreur lors de la génération du ticket :", error);
    return null;
  }
};

// ✅ Exporter sous forme d’un service global
const ticketService = {
  generateTk,
};

export default ticketService;
