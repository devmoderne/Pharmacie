import axiosInstance from './axiosInstance';

const API_URL = '/detailsticket';

const detailsVenteService = {
  // Ajouter un détail de ticket
  addDetailsTicket: async (detailsData) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/add`, detailsData);
      console.log("💾 addDetailsTicket response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur addDetailsTicket:", error);
      throw error;
    }
  },

  // Récupérer tous les détails de tickets
  getAllDetailsTickets: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/all`);
      console.log("📄 getAllDetailsTickets response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur getAllDetailsTickets:", error);
      throw error;
    }
  },

  // Mettre à jour un détail de ticket
  updateDetailsTicket: async (id, detailsData) => {
    try {
      const response = await axiosInstance.put(`${API_URL}/update/${id}`, detailsData);
      console.log("✏️ updateDetailsTicket response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur updateDetailsTicket:", error);
      throw error;
    }
  },

  // Supprimer un détail de ticket par id
  deleteDetailsTicket: async (id) => {
    try {
      const response = await axiosInstance.delete(`${API_URL}/delete/${id}`);
      console.log("🗑️ deleteDetailsTicket response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur deleteDetailsTicket:", error);
      throw error;
    }
  },

  // Supprimer un détail de ticket par produit et codeTicket
  deleteDetailsTicketByProduit: async (produitId, codeTicket) => {
    try {
      console.log("🔹 deleteDetailsTicketByProduit request:", { produitId, codeTicket });
      const response = await axiosInstance.put(`${API_URL}/disable/${produitId}/${codeTicket}`);
      console.log("🗑️ deleteDetailsTicketByProduit response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur deleteDetailsTicketByProduit:", error);
      throw error;
    }
  },

  // Finaliser un ticket
  finaliserTicket______: async (codeTicket) => {
    try {
      console.log("🔹 finaliserTicket request:", codeTicket);
      const response = await axiosInstance.put(`${API_URL}/finaliser/${codeTicket}`);
      console.log("✅ finaliserTicket response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur finaliserTicket:", error);
      throw error;
    }
  },

// Finaliser un ticket avec tva, remise, remis et netAPayer
finaliserTicket: async (codeTicket, tva, remise, remis, payer) => {
  try {
    console.log("🔹 finaliserTicket request:", { codeTicket, tva, remise, remis, payer });

    const response = await axiosInstance.put(
      `${API_URL}/finaliser/${codeTicket}`,
      { tva, remise, remis, payer } // 🔹 envoyés dans le body JSON
    );

    console.log("✅ finaliserTicket response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur finaliserTicket:", error);
    throw error;
  }
},


};


export default detailsVenteService;
