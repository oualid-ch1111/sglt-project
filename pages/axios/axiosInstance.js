import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    Authorization: `Bearer ${token}`, // Assurez-vous d'avoir une manière de récupérer le token ici
  },
});

export default axiosInstance;
