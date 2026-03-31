import axiosInstance from './axiosInstance';

const MesventeService = {

  getAll: async () => {
    const response = await axiosInstance.get('/mesventes/all');
    return response.data; // reste une liste complète
  },

  // 🔹 Méthode avec filtres et pagination
  get: async (params) => {
    // params peut contenir : client, userId, startDate, endDate, page, size
    const response = await axiosInstance.get('/mesventes/actives', { params });
    return response.data; 
    // ⚠️ data contient maintenant un objet Page :
    // { content: [...], totalPages: 5, totalElements: 42, number: 0, size: 10, ... }
  },

  deleteOne: async (id) => {
    const response = await axiosInstance.post(`/mesventes/annuler/${id}`);
    return response.data;
  },

  getVentesDuJourByUser: async (userId) => {
    const res = await axiosInstance.get(`/mesventes/jour/${userId}`);
    return res.data;
  },

  getVentesDuJourByPhone: async (phone) => {
    const res = await axiosInstance.get(`/mesventes/jour/by-phone/${phone}`);
    return res.data;
  },

};

export default MesventeService;