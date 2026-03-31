import axiosInstance from './axiosInstance';

const produitService = {
  // Ajouter un produit
  addProduit: async (produitData) => {
    const response = await axiosInstance.post('/produit/add', produitData);
    return response.data;
  },

  // Récupérer tous les produits
  getAllProduits: async () => {
    const response = await axiosInstance.get('/produit/all');
    return response.data;
  },

  // Pagination
  getAllPaged: async (page = 0, size = 10) => {
    const response = await axiosInstance.get(`/produit?page=${page}&size=${size}`);
    return response.data; // Page<Produit> = { content: [...], totalPages, totalElements, ... }
  },

  // 🔹 Recherche paginée
  searchProduits: async (keyword, page = 0, size = 10) => {
    const response = await axiosInstance.get(
      `/produit/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`
    );
    return response.data; // Page<Produit>
  },

  // Mettre à jour un produit
  updateProduit: async (id, produitData) => {
    const response = await axiosInstance.put(`/produit/update/${id}`, produitData);
    return response.data;
  },

  // Supprimer un produit
  deleteProduit: async (id) => {
    const response = await axiosInstance.delete(`/produit/delete/${id}`);
    return response.data;
  },

  // Récupérer toutes les catégories
  getCategories: async () => {
    const response = await axiosInstance.get('/categorie/all');
    return response.data;
  },

  // 🔹 Stats par produit
  getStats: async (produitId) => {
    const response = await axiosInstance.get(`/produit/stats/${produitId}`);
    return response.data;
  }
};

export default produitService;