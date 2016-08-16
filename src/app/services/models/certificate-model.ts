import { Model } from './model'
import { Restangular } from '../restangular';

export class CertificateModel implements Model {

  /*Restangular*/
  restangular:Restangular;

  /*Attributes*/
  public alias:string;//Alias del Certificado
  public certified:any;//Certificado
  public password:string;//password del certificado
  public passwordConfirmation:string;//IMPORTE TOTAL
  public validity:Date;//Fecha Vigencia

  /*Constructor*/
  constructor(restangular:Restangular) {
    this.restangular = restangular;
  }

  public clone(): CertificateModel {
    let copy = Object.assign({}, this);
    delete copy['restangular'];
    return copy;
  }
  public save() {
    return this.restangular.put(this.clone());
  }
}