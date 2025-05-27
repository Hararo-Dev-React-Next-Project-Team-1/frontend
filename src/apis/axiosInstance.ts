import axios from 'axios';

const API_PORT = 3000;

const axiosInstance = axios.create({
  baseURL: `${window.location.protocol}//${window.location.hostname}:${API_PORT}/api/`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default axiosInstance;