import axiosInstance from '../axiosInstance';

const API_URL = '/examens';

class ApiExamen {
  static async demander(dossierId, typeExamenId) {
    return (
      await axiosInstance.post(API_URL, null, {
        params: { dossierId, typeExamenId },
      })
    ).data;
  }

  static async updateEtat(id, etat) {
    return (
      await axiosInstance.put(`${API_URL}/${id}/etat`, null, {
        params: { etat },
      })
    ).data;
  }

  static async getByDossier(dossierId) {
    return (await axiosInstance.get(`${API_URL}/dossier/${dossierId}`)).data;
  }

  static async get(id) {
    return (await axiosInstance.get(`${API_URL}/${id}`)).data;
  }
}

export default ApiExamen;
