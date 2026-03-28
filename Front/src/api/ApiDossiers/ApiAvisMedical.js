import axiosInstance from '../axiosInstance';

const API_URL = '/avis';

class ApiAvisMedical {
  static async create(data) {
    return (await axiosInstance.post(API_URL, data)).data;
  }

  static async get(id) {
    return (await axiosInstance.get(`${API_URL}/${id}`)).data;
  }

  static async getByDossier(dossierId) {
    return (await axiosInstance.get(`${API_URL}/dossier/${dossierId}`)).data;
  }

  static async update(data) {
    return (await axiosInstance.put(API_URL, data)).data;
  }

  static async delete(id) {
    return (await axiosInstance.delete(`${API_URL}/${id}`)).data;
  }
}

export default ApiAvisMedical;
