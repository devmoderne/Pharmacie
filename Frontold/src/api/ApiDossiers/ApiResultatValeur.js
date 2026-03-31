import axiosInstance from '../axiosInstance';

const API_URL = '/valeurs';

class ApiResultatValeur {
  static async create(data) {
    return (await axiosInstance.post(API_URL, data)).data;
  }

  static async get(id) {
    return (await axiosInstance.get(`${API_URL}/${id}`)).data;
  }

  static async getByResultat(resultatId) {
    return (await axiosInstance.get(`${API_URL}/resultat/${resultatId}`)).data;
  }

  static async getSousValeurs(parentId) {
    return (await axiosInstance.get(`${API_URL}/parent/${parentId}`)).data;
  }

  static async update(id, valeur) {
    return (
      await axiosInstance.put(`${API_URL}/${id}`, null, {
        params: { valeur },
      })
    ).data;
  }
}

export default ApiResultatValeur;
