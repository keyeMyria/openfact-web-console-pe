import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { URLSearchParams } from '@angular/http';

import { RestangularOpenfact } from './restangular-openfact';
import { Organization } from '../models/organization.model';
import { SearchResults } from '../models/search-results.model';
import { SearchCriteria } from '../models/search-criteria.model';
import { KeysMetadata } from '../models/keys-metadata.model';

export const organizationIdName: string = 'organization';
export const organizationBasePath: string = 'organizations';

@Injectable()
export class OrganizationService {

    private restangular: RestangularOpenfact;

    constructor(restangular: RestangularOpenfact) {
        this.restangular = restangular;
    }

    public build(id?: string): Organization {
        let organization = new Organization();
        organization.organization = id;
        organization.restangular = this.restangular.one(organizationBasePath, id);
        return organization;
    }

    public findById(id: string): Observable<Organization> {
        return this.restangular
            .one(organizationBasePath, id)
            .get()
            .map(response => {
                let json = <Organization>response.json();
                let result = new Organization();
                result.restangular = this.restangular.one(organizationBasePath, json[organizationIdName]);
                result = Object.assign(result, json);
                return result;
            });
    }

    public create(organization: Organization): Observable<Organization> {
        return this.restangular
            .all(organizationBasePath)
            .post(organization)
            .map(response => {
                if (response.status === 201 || 204) {
                    return undefined;
                }
                let json = <Organization>response.json();
                let result = new Organization();
                result.restangular = this.restangular.one(organizationBasePath, json[organizationIdName]);
                result = Object.assign(result, json);
                return result;
            });
    }

    public getAll(): Observable<Organization[]> {
        return this.restangular
            .all(organizationBasePath)
            .get()
            .map(response => {
                let json = <Organization[]>response.json();
                let result = new Array<Organization>();
                json.forEach(element => {
                    let organization = new Organization();
                    organization.restangular = this.restangular.one(organizationBasePath, element[organizationIdName]);
                    organization = Object.assign(organization, element);
                    result.push(organization);
                });
                return result;
            });
    }

    public search(criteria: SearchCriteria): Observable<SearchResults<Organization>> {
        return this.restangular
            .all(organizationBasePath)
            .all("search")
            .post(criteria)
            .map(response => {
                let json = <SearchResults<Organization>>response.json();
                let result = new SearchResults<Organization>();
                let items = new Array<Organization>();

                json.items.forEach(element => {
                    let organization = new Organization();
                    organization.restangular = this.restangular.one(organizationBasePath, element[organizationIdName]);
                    organization = Object.assign(organization, element);
                    items.push(organization);
                });

                result.items = items;
                result.totalSize = json.totalSize;
                return result;
            });
    }

    getOrganizationKeys(organization: Organization, queryParams?: URLSearchParams) {
        return this.restangular
            .one(organizationBasePath, organization.organization)
            .all('keys')
            .get(queryParams)
            .map(response => {
                let json = <any>response.json();
                return json;
            });
    }

    getComponent(organization: Organization, componentId, queryParams?: URLSearchParams) {
        return this.restangular
            .one(organizationBasePath, organization.organization)
            .one('components', componentId)
            .get(queryParams)
            .map(response => {
                let json = <any>response.json();
                return json;
            });
    }

    getComponents(organization: Organization, queryParams?: URLSearchParams) {
        return this.restangular
            .one(organizationBasePath, organization.organization)
            .all('components')
            .get(queryParams)
            .map(response => {
                let json = <any>response.json();
                return json;
            });
    }

    createComponent(organization: Organization, component: any) {
        return this.restangular
            .one(organizationBasePath, organization.organization)
            .all('components')
            .post(component);
    }

    updateComponent(organization: Organization, componentId: string, component: any) {
        return this.restangular
            .one(organizationBasePath, organization.organization)
            .one('components', componentId)
            .put(component);
    }

    removeComponent(organization: Organization, componentId: any) {
        return this.restangular
            .one(organizationBasePath, organization.organization)
            .one('components', componentId)
            .delete();
    }

    getEventsConfig(organization: Organization, queryParams?: URLSearchParams) {
        return this.restangular
            .one(organizationBasePath, organization.organization)
            .all('events/config')
            .get(queryParams)
            .map(response => {
                let json = <any>response.json();
                return json;
            });
    }

    updateEventsConfig(organization: Organization, config: any) {
        return this.restangular
            .one(organizationBasePath, organization.organization)
            .all('events/config')
            .put(config);
    }

    getClearAdminEvents(organization: Organization) {
        return this.restangular
            .one(organizationBasePath, organization.organization)
            .all('admin-events')
            .delete();
    }

    getAdminEvents(organization: Organization, queryParams?: URLSearchParams) {
        return this.restangular
            .one(organizationBasePath, organization.organization)
            .all('admin-events')
            .get(queryParams)
            .map(response => {
                let json = <any>response.json();
                return json;
            });
    }

}