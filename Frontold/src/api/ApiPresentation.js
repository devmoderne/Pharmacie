import axiosInstance from './axiosInstance'; // Assure-toi que le chemin est correct

const API_URL = '/presentation'; // Plus besoin de tout le chemin car baseURL est déjà défini

class presentationService {
  // Récupération des designations
  static async getPresentation() {
    try {
      const response = await axiosInstance.get(API_URL+"/all");
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Erreur lors de la récupération des designations');
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des designations :", error);
      throw new Error(`Une erreur s'est produite : ${error.message}`);
    }
  }

  // Ajout d'une designation
  static async addPresentation(presentation) {
    try {
      const response = await axiosInstance.post(API_URL+"/add",presentation);
      if (response.status === 201) {
        return response.data;
      } else {
        throw new Error('Erreur lors de l\'ajout de la designation');
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      throw error;
    }
  }

static async updatePresentation(id, presentation) {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, presentation);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Erreur lors de la modification');
    }
  } catch (error) {
    console.error("Erreur lors de la modification :", error);
    throw error;
  }
}


  // Suppression d'une designation
  static async deletePresentation(id) {
    try {
      const response = await axiosInstance.delete(`${API_URL}/${id}`);
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      throw error;
    }
  }

  static async searchExamen(keyword) {
  try {
    const response = await axiosInstance.get(`/presentation/search?keyword=${keyword}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la recherche des examen :", error);
    throw error;
  }
}
static async searchMedicament(keyword) {
  try {
    const response = await axiosInstance.get(`/presentation/searchmedic?keyword=${keyword}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la recherche des presenataion:", error);
    throw error;
  }
}

}

export default presentationService;