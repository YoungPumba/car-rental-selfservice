import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// helper do ustawiania nagłówka Authorization
export function setAuthToken(token) {
  if (token) {
    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosClient.defaults.headers.common['Authorization'];
  }
}

export default axiosClient;
