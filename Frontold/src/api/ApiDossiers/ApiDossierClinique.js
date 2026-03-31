import axiosInstance from '../axiosInstance';

const API_URL = '/dossiers';

class ApiDossierClinique {
  static async create(data) {
    return (await axiosInstance.post(API_URL, data)).data;
  }

  static async get(id) {
    return (await axiosInstance.get(`${API_URL}/${id}`)).data;
  }

  static async getAll() {
    return (await axiosInstance.get(API_URL)).data;
  }

  static async update(id, data) {
    return (await axiosInstance.put(`${API_URL}/${id}`, data)).data;
  }

  static async close(id) {
    return (await axiosInstance.put(`${API_URL}/${id}/clore`)).data;
  }
}

export default ApiDossierClinique;
