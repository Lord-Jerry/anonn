import axios, { AxiosRequestConfig} from "axios";

import { API_SERVER } from '@config/index'
import { retrieveData, StoreKeys} from './asynstorage';

export default (token?: string) =>{
  const ApiInstance =  axios.create({
    baseURL: API_SERVER,
    timeout: 50000,
    // headers: { Authorization: token ? `Bearer ${token}` : undefined,  Accept: "application/json" },
  })

  ApiInstance.interceptors.request.use(
    async (config) => {
      const token = await retrieveData(StoreKeys.token) || undefined;
      config.headers['Authorization'] = token ? `Bearer ${token}` : undefined;
      
      return config;
    },
    (error) => {
      console.log(error)
      Promise.reject(error);
    }
  )

  return ApiInstance
};
