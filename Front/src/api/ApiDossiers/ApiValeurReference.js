import axiosInstance from '../axiosInstance';

const API_URL = '/valeurs-reference';

class ApiValeurReference {
  static async create(data) {
    return (await axiosInstance.post(API_URL, data)).data;
  }

  static async get(id) {
    return (await axiosInstance.get(`${API_URL}/${id}`)).data;
  }

  static async getByType(typeId) {
    return (await axiosInstance.get(`${API_URL}/type/${typeId}`)).data;
  }

  static async update(id, min, max, unite) {
    return (
      await axiosInstance.put(`${API_URL}/${id}`, null, {
        params: { min, max, unite },
      })
    ).data;
  }

  static async delete(id) {
    return (await axiosInstance.delete(`${API_URL}/${id}`)).data;
  }
}

export default ApiValeurReference;
