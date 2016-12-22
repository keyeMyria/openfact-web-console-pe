import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response, URLSearchParams } from '@angular/http';

import { RestangularOpenfact } from './restangular-openfact';
import { Organization } from '../models/organization.model';
import { SearchResults } from '../models/search-results.model';
import { SearchCriteria } from '../models/search-criteria.model';
import { KeysMetadata } from '../models/keys-metadata.model';

import { Invoice } from '../models/invoice.model';

export const idName: string = 'id';
export const basePath: string = 'sunat';

@Injectable()
export class OrganizationPeService {

  private restangular: RestangularOpenfact;

  constructor(restangular: RestangularOpenfact) {
    this.restangular = restangular;
  }

  public createInvoice(organization: Organization, invoice: Invoice): Observable<Invoice> {
    let restangular = organization.restangular;
    return this.restangular.one("organizations", organization.organization)
      .all(basePath)
      .all("invoices")
      .post(invoice)
      .map(response => {
        if (response.status === 201 || 204) {
          return undefined;
        }
        return response.json();
      });
  }

  public createCreditNote(organization: Organization, creditNote: any): Observable<Invoice> {
    let restangular = organization.restangular;
    return this.restangular.one("organizations", organization.organization)
      .all(basePath)
      .all("credit-notes")
      .post(creditNote)
      .map(response => {
        if (response.status === 201 || 204) {
          return undefined;
        }
        return response.json();
      });
  }

  public createDebitNote(organization: Organization, debitNote: any): Observable<Invoice> {
    let restangular = organization.restangular;
    return this.restangular.one("organizations", organization.organization)
      .all(basePath)
      .all("debit-notes")
      .post(debitNote)
      .map(response => {
        if (response.status === 201 || 204) {
          return undefined;
        }
        return response.json();
      });
  }

}
