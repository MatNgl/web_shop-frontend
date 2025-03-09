import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// Ajout du token d'accès sur chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gestion du rafraîchissement du token en cas de 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  response => response,
  error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        // Aucun refresh token, rediriger vers la connexion
        return Promise.reject(error);
      }

      return new Promise((resolve, reject) => {
        axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/refresh`, { refreshToken })
          .then(({ data }) => {
            localStorage.setItem('token', data.access_token);
            // Optionnel : si le backend renvoie un nouveau refresh token
            if (data.refreshToken) {
              localStorage.setItem('refreshToken', data.refreshToken);
            }
            api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
            originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
            processQueue(null, data.access_token);
            resolve(api(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            // Si le rafraîchissement échoue, déconnecter l'utilisateur
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }
    return Promise.reject(error);
  }
);

export default api;
