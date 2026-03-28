import axiosInstance from '../axiosInstance';

const API_URL = '/types-examens';

class ApiTypeExamen {
  static async create(data) {
    return (await axiosInstance.post(API_URL, data)).data;
  }

  static async get(id) {
    return (await axiosInstance.get(`${API_URL}/${id}`)).data;
  }

  static async getAll() {
    return (await axiosInstance.get(API_URL)).data;
  }

  static async update(id, nouveauNom) {
    return (
      await axiosInstance.put(`${API_URL}/${id}`, null, {
        params: { nouveauNom },
      })
    ).data;
  }

  static async delete(id) {
    return (await axiosInstance.delete(`${API_URL}/${id}`)).data;
  }
}

export default ApiTypeExamen;
