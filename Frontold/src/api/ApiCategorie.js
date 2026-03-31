import axiosInstance from './axiosInstance';

const categorieService = {
  addCategorie: async (categorieData) => {
    const response = await axiosInstance.post('/categorie/add', categorieData);
    return response.data;
  },

  getAllCategories: async () => {
    const response = await axiosInstance.get('/categorie/all');
    return response.data;
  },

  updateCategorie: async (id, categorieData) => {
    const response = await axiosInstance.put(`/categorie/update/${id}`, categorieData);
    return response.data;
  },

  deleteCategorie: async (id) => {
    const response = await axiosInstance.delete(`/categorie/delete/${id}`);
    return response.data;
  }
};

export default categorieService;
