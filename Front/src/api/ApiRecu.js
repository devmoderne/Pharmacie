import axiosInstance from './axiosInstance';

const recuService = {

  async getPdfTicket(codeTicket) {
    try {
      const response = await axiosInstance.get(`/tickets/${codeTicket}/pdf`, {
        responseType: 'blob',
      });

      if (!response || !response.data) {
        console.warn('⚠️ Aucun contenu PDF reçu du backend.');
        return null;
      }

      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      return URL.createObjectURL(pdfBlob);

    } catch (error) {
      console.error('❌ Erreur lors de la récupération du PDF :', error);
      return null;
    }
  },

  // 🔥 Pagination ici
  async getAllRecus(page = 0, size = 10) {
    try {
      const response = await axiosInstance.get('/tickets/recu/all', {
        params: { page, size }
      });

      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des reçus :', error);
      return null;
    }
  },

  async deletePdfTicket(codeTicket) {
    try {
      const response = await axiosInstance.delete(`/tickets/recu/${codeTicket}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du PDF :', error);
      return null;
    }
  },

  async pdfExists(codeTicket) {
    try {
      await axiosInstance.head(`/tickets/${codeTicket}/pdf`);
      return true;
    } catch {
      return false;
    }
  },
};

export default recuService;