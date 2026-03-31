import axiosInstance from './axiosInstance'; // Assure-toi que le chemin est correct

const API_URL = '/nomproduit'; // Endpoint côté backend pour NomProduit

class NomProduitService {
  // Récupérer tous les noms de produit
  static async getAll() {
    try {
      const response = await axiosInstance.get(`${API_URL}/all`);
      if (response.status === 200) return response.data;
      throw new Error('Erreur lors de la récupération des noms de produit');
    } catch (error) {
      console.error("Erreur getAll NomProduit:", error);
      throw error;
    }
  }

  // Ajouter un nouveau nom de produit
  static async add(nomProduit) {
    try {
      const response = await axiosInstance.post(`${API_URL}/add`, nomProduit);
      if (response.status === 201) return response.data;
      throw new Error('Erreur lors de l\'ajout du nom de produit');
    } catch (error) {
      console.error("Erreur add NomProduit:", error);
      throw error;
    }
  }

  // Mettre à jour un nom de produit
  static async update(id, nomProduit) {
    try {
      const response = await axiosInstance.put(`${API_URL}/${id}`, nomProduit);
      if (response.status === 200) return response.data;
      throw new Error('Erreur lors de la mise à jour du nom de produit');
    } catch (error) {
      console.error("Erreur update NomProduit:", error);
      throw error;
    }
  }

  // Supprimer un nom de produit
  static async delete(id) {
    try {
      const response = await axiosInstance.delete(`${API_URL}/${id}`);
      if (response.status === 200) return response.data;
      throw new Error('Erreur lors de la suppression du nom de produit');
    } catch (error) {
      console.error("Erreur delete NomProduit:", error);
      throw error;
    }
  }

  // Recherche par mot-clé
  static async search(keyword) {
    try {
      const response = await axiosInstance.get(`${API_URL}/search?keyword=${keyword}`);
      return response.data;
    } catch (error) {
      console.error("Erreur search NomProduit:", error);
      throw error;
    }
  }
}

export default NomProduitService;
