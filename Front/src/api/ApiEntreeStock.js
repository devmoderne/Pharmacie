import axiosInstance from './axiosInstance'; // Assure-toi que le chemin est correct

const API_URL = '/entree-stock'; // ✅ Corrigé : point-virgule supprimé

class ApiEntreeStock {

  // ✅ Récupération de toutes les entrées de stock
  static async getAll() {
    try {
      const response = await axiosInstance.get(`${API_URL}/all`);
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Erreur lors de la récupération des entrées de stock");
      }
    } catch (error) {
      console.error("Erreur getAll EntreeStock :", error);
      throw error;
    }
  }

  // ✅ Recherche paginée
static async search(search, page = 0, size = 10) {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/search?search=${search}&page=${page}&size=${size}`
    );

    return response.data; 
    // { content: [...], totalPages, totalElements, number }
  } catch (error) {
    console.error("Erreur search EntreeStock :", error);
    throw error;
  }
}

   static async getAllPaged(page = 0, size = 10) {
    try {
      const response = await axiosInstance.get(
        `${API_URL}?page=${page}&size=${size}`
      );
      return response.data; // Page<EntreeStock> = { content: [...], totalPages, totalElements, ... }
    } catch (error) {
      console.error("Erreur getAllPaged EntreeStock :", error);
      throw error;
    }
  }
  
  // ✅ Ajout d’une nouvelle entrée de stock
  static async add(entreeStock) {
    try {
      const response = await axiosInstance.post(`${API_URL}/add`, entreeStock);
      if (response.status === 201) {
        return response.data;
      } else {
        throw new Error("Erreur lors de l'ajout de l'entrée de stock");
      }
    } catch (error) {
      console.error("Erreur add EntreeStock :", error);
      throw error;
    }
  }

  // ✅ Mise à jour d’une entrée de stock
  static async update(id, entreeStock) {
    try {
      const response = await axiosInstance.put(`${API_URL}/update/${id}`, entreeStock);
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Erreur lors de la modification de l'entrée de stock");
      }
    } catch (error) {
      console.error("Erreur update EntreeStock :", error);
      throw error;
    }
  }

  // ✅ Suppression d’une entrée de stock
  static async delete(id) {
    try {
      const response = await axiosInstance.delete(`${API_URL}/delete/${id}`);
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Erreur lors de la suppression de l'entrée de stock");
      }
    } catch (error) {
      console.error("Erreur delete EntreeStock :", error);
      throw error;
    }
  }

 /* // ✅ Recherche (si tu veux filtrer par produit, fournisseur, etc.)
  static async search(keyword) {
    try {
      const response = await axiosInstance.get(`${API_URL}/search?keyword=${keyword}`);
      return response.data;
    } catch (error) {
      console.error("Erreur search EntreeStock :", error);
      throw error;
    }
  }*/
}

export default ApiEntreeStock;
