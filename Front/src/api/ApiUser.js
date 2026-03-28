import axiosInstance from './axiosInstance';

// 🔐 Récupérer le token
const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token || localStorage.getItem('token');
};

const userService = {
  // 🔑 Connexion
  login: async (telephone, password) => {
    const response = await axiosInstance.post('/users/auth/login', { telephone, password });
    console.log("📦 Réponse du backend (login):", response.data);

    const { id, nom, prenoms, username, roles, access_token, refresh_token } = response.data;

    // Stocker tokens
    localStorage.setItem('token', access_token);
    localStorage.setItem('refresh_token', refresh_token);

    // Stocker infos utilisateur
    const user = { id, nom, prenoms, username, roles, token: access_token };
    localStorage.setItem('user', JSON.stringify(user));
      console.log(user);
    return { token: access_token, user };
  },

  // 🚪 Déconnexion
  logout: () => {
    localStorage.clear();
    console.log("Déconnecté");
  },

  // 👥 Récupérer tous les utilisateurs (ADMIN)
  getAllUsers: async () => {
    const response = await axiosInstance.get('/users');
    return response.data;
  },

  addUser: async (userData) => axiosInstance.post('/users', userData).then(res => res.data),
  updateUser: async (telephone, userData) => axiosInstance.put(`/users/${telephone}`, userData).then(res => res.data),
  changePassword: async (username, oldPassword, newPassword) => axiosInstance.post('/users/auth/change-password', { username, oldPassword, newPassword }).then(res => res.data),
  addRole: async (roleData) => axiosInstance.post('/users/roles', roleData).then(res => res.data),
  addRoleToUser: async (telephone, roleName) => axiosInstance.post('/users/addRoleToUser', { telephone, roleName }).then(res => res.data),
};

export default userService;
