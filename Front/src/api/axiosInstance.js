import axios from 'axios';

// Créer l'instance Axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  timeout: 20000,
});

// Intercepteur de requête : Ajouter automatiquement le token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Intercepteur de réponse : Gestion des erreurs 401/403
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && [401, 403].includes(error.response.status)) {
      localStorage.clear();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
