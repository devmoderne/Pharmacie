import axiosInstance from './axiosInstance';


const FournisseurService = {
  // Ajouter un fournisseur
  addFournisseur: async (fournisseurData) => {
    const response = await axiosInstance.post('/fournisseur/add', fournisseurData);
    return response.data;
  },

  // Récupérer tous les fournisseurs
  getAllFournisseurs: async () => {
    const response = await axiosInstance.get('/fournisseur/all');
    return response.data;
  },

  // Mettre à jour un fournisseur
  updateFournisseur: async (id, fournisseurData) => {
    const response = await axiosInstance.put(`/fournisseur/update/${id}`, fournisseurData);
    return response.data;
  },

  // Supprimer un fournisseur
  deleteFournisseur: async (id) => {
    const response = await axiosInstance.delete(`/fournisseur/delete/${id}`);
    return response.data;
  }
};

export default FournisseurService;
