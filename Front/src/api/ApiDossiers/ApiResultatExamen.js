import axiosInstance from '../axiosInstance';

const API_URL = '/resultats';

class ApiResultatExamen {
  static async create(examenId, technicienId, commentaire) {
    return (
      await axiosInstance.post(API_URL, null, {
        params: { examenId, technicienId, commentaire },
      })
    ).data;
  }

  static async get(id) {
    return (await axiosInstance.get(`${API_URL}/${id}`)).data;
  }

  static async getByExamen(examenId) {
    return (await axiosInstance.get(`${API_URL}/examen/${examenId}`)).data;
  }
}

export default ApiResultatExamen;
