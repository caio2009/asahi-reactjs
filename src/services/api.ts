import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.101:3333'
});

let isRefreshing = false;
let failedRequestsQueue: any[] = [];

api.interceptors.response.use((res) => {
  return res;
}, (err: AxiosError) => {
  if (err.response?.status === 401) {
    if (err.response.data?.message === 'Expired access token.') {
      const refreshToken = localStorage.getItem('asahi.refreshToken');
      const originalConfig = err.config;

      if (!isRefreshing) {
        isRefreshing = true;

        api.post('sessions/refresh', { refreshToken })
          .then((res) => {
            const { accessToken, refreshToken: newRefreshToken } = res.data;

            localStorage.setItem('asahi.accessToken', accessToken);
            localStorage.setItem('asahi.refreshToken', newRefreshToken);

            api.defaults.headers.authorization = `Bearer ${accessToken}`;

            failedRequestsQueue.forEach(request => request.onSuccess(accessToken));
            failedRequestsQueue = [];
          })
          .catch((err) => {
            failedRequestsQueue.forEach(request => request.onFailure(err));
            failedRequestsQueue = [];

            // signout
            localStorage.removeItem('asahi.user');
            localStorage.removeItem('asahi.accessToken');
            localStorage.removeItem('asahi.refreshToken');

            // eslint-disable-next-line no-restricted-globals
            history.pushState(null, '', '/');
          })
          .finally(() => {
            isRefreshing = false;
          });
      }

      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({
          onSuccess: (accessToken: string) => {
            originalConfig.headers.authorization = `Bearer ${accessToken}`;

            resolve(api(originalConfig));
          },
          onFailure: (err: AxiosError) => {
            reject(err);
          }
        })
      })
    } else {
      // signout
      localStorage.removeItem('asahi.user');
      localStorage.removeItem('asahi.accessToken');
      localStorage.removeItem('asahi.refreshToken');

      // eslint-disable-next-line no-restricted-globals
      history.pushState(null, '', '/');
    }
  }

  return Promise.reject(err);
});

export default api;