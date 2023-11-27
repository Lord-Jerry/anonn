import axios from 'axios';
import {retrieveData, StoreKeys} from './asynstorage';

import {API_SERVER} from 'config/index';

export default () => {
  const instance = axios.create({
    baseURL: API_SERVER,
    timeout: 50000,
  });

  instance.interceptors.request.use(async config => {
    const token = await retrieveData(StoreKeys.token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    response => response,
    error => {
      console.error('Axios Request Error: ', {
        url: error.config.url,
        method: error.config.method,
        headers: error.config.headers,
        data: error.config.data,
        response: error.response
          ? {
              status: error.response.status,
              statusText: error.response.statusText,
              headers: error.response.headers,
              data: error.response.data,
            }
          : null,
      });

      return Promise.reject(error);
    },
  );

  return instance;
};
