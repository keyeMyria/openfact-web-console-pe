import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RestangularOpenfact } from './restangular-openfact';
import { Organization, DebitNote } from '../models';
import { SearchResults, SearchCriteria } from '../models';

export const DEBITNOTE_ID_NAME: string = 'id';
export const DEBITNOTE_BASE_PATH: string = 'debit-notes';

@Injectable()
export class DebitnoteService {

  constructor() { }

  public findById(organization: Organization, id: string): Observable<DebitNote> {
    let restangular = organization.restangular;
    return restangular
      .one(DEBITNOTE_BASE_PATH, id)
      .get()
      .map(response => {
        let json = <DebitNote>response.json();
        let result = new DebitNote();
        result.restangular = restangular.one(DEBITNOTE_BASE_PATH, json[DEBITNOTE_ID_NAME]);
        result = Object.assign(result, json);
        return result;
      });
  }

  public create(organization: Organization, debitnote: DebitNote): Observable<DebitNote> {
    let restangular = organization.restangular;
    return restangular
      .all(DEBITNOTE_BASE_PATH)
      .post(debitnote)
      .map(response => {
        if (response.status === 201 || 204) {
          return undefined;
        }
        let json = <DebitNote>response.json();
        let result = new DebitNote();
        result.restangular = restangular.one(DEBITNOTE_BASE_PATH, json[DEBITNOTE_ID_NAME]);
        result = Object.assign(result, json);
        return result;
      });
  }

  public getAll(organization: Organization): Observable<DebitNote[]> {
    let restangular = organization.restangular;
    return restangular
      .all(DEBITNOTE_BASE_PATH)
      .get()
      .map(response => {
        let json = <DebitNote[]>response.json();
        let result = new Array<DebitNote>();
        json.forEach(element => {
          let debitnote = new DebitNote();
          debitnote.restangular = restangular.one(DEBITNOTE_BASE_PATH, element[DEBITNOTE_ID_NAME]);
          debitnote = Object.assign(debitnote, element);
          result.push(debitnote);
        });
        return result;
      });
  }

  public search(organization: Organization, criteria: SearchCriteria): Observable<SearchResults<DebitNote>> {
    let restangular = organization.restangular;
    return restangular
      .all(DEBITNOTE_BASE_PATH)
      .all("search")
      .post(criteria)
      .map(response => {
        let json = <SearchResults<DebitNote>>response.json();
        let result = new SearchResults<DebitNote>();
        let items = new Array<DebitNote>();

        json.items.forEach(element => {
          let debitnote = new DebitNote();
          debitnote.restangular = restangular.one(DEBITNOTE_BASE_PATH, element[DEBITNOTE_ID_NAME]);
          debitnote = Object.assign(debitnote, element);
          items.push(debitnote);
        });

        result.items = items;
        result.totalSize = json.totalSize;
        return result;
      });
  }

}
