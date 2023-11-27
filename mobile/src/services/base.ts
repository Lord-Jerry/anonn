import {Axios} from 'axios';

import ApiService from './api';

export default class BaseService {
  public api: Axios;

  constructor() {
    this.api = ApiService();
  }
}
