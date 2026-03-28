import axiosInstance from './axiosInstance';

// Récupérer le token dans le localStorage
const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token;
};

const clientService = {
  // Ajouter un client
  addClient: async (clientData) => {
    const response = await axiosInstance.post('/client/add', clientData, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return response.data;
  },

  // Récupérer tous les clients
  getAllClients: async () => {
    const response = await axiosInstance.get('/client/all', {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return response.data;
  },

  // Mettre à jour un client
  updateClient: async (id, clientData) => {
    const response = await axiosInstance.put(`/client/update/${id}`, clientData, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return response.data;
  },

  // Supprimer un client
  deleteClient: async (id) => {
    const response = await axiosInstance.delete(`/client/delete/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return response.data;
  }
};

export default clientService;
