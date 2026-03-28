import axiosInstance from '../axiosInstance';

const API_URL = '/consultations';

class ApiConsultation {
  static async create(data) {
    return (await axiosInstance.post(API_URL, data)).data;
  }

  static async get(id) {
    return (await axiosInstance.get(`${API_URL}/${id}`)).data;
  }

  static async getByPatient(patientId) {
    return (await axiosInstance.get(`${API_URL}/patient/${patientId}`)).data;
  }

  static async getByMedecin(medecinId) {
    return (await axiosInstance.get(`${API_URL}/medecin/${medecinId}`)).data;
  }
}

export default ApiConsultation;
