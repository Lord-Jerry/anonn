import {Axios} from 'axios';

import ApiService from './api';
import {retrieveData, StoreKeys} from './asynstorage';

export default class BaseService {
  public api: Axios;

  constructor() {
    this.api = ApiService();
    this.init();
  }

  async init() {
    const token = (await retrieveData(StoreKeys.token)) ?? undefined;
    this.api = ApiService(token);
  }
}
