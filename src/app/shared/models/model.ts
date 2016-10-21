import { Restangular } from '../services';

export abstract class Model {

  restangular: Restangular;

  constructor() { }

  save(obj?: any) {
    if (obj) {
      return this.restangular.put(obj);
    } else {
      return this.restangular.put(this);
    }
  }

}
