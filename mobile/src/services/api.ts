import axios from 'axios';

import {API_SERVER} from 'config/index';

export default (token?: string) =>
  axios.create({
    baseURL: API_SERVER,
    timeout: 50000,
    headers: {Authorization: token ? `Bearer ${token}` : undefined},
  });
