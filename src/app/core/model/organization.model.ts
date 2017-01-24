import { Model } from './model';
import { Observable } from 'rxjs/Observable';
import { RestangularService } from './../data/restangular.service';
import { URLSearchParams } from '@angular/http';

export class Organization extends Model {

    id: string;
    organization: string;

    internationalizationEnabled: boolean;
    defaultLocale: string;

    constructor(restangular: RestangularService) {
        super(restangular);
    }

    build(): Organization {
        return new Organization(this.restangular);
    }

    getOrganizationKeys(queryParams?: URLSearchParams) {
        return this.restangular
            .all('keys')
            .get(queryParams)
            .map(response => response.json());
    }

    getComponent(componentId, queryParams?: URLSearchParams) {
        return this.restangular
            .one('components', componentId)
            .get(queryParams)
            .map(response => response.json());
    }

    getComponents(queryParams?: URLSearchParams) {
        return this.restangular
            .all('components')
            .get(queryParams)
            .map(response => response.json());
    }

    createComponent(component: any) {
        return this.restangular
            .all('components')
            .post(component);
    }

    updateComponent(componentId: string, component: any) {
        return this.restangular
            .one('components', componentId)
            .put(component);
    }

    removeComponent(componentId: any) {
        return this.restangular
            .one('components', componentId)
            .delete();
    }

    getEventsConfig(queryParams?: URLSearchParams) {
        return this.restangular
            .all('events/config')
            .get(queryParams)
            .map(response => response.json());
    }

    updateEventsConfig(config: any) {
        return this.restangular
            .all('events/config')
            .put(config);
    }

    getClearAdminEvents(organization: Organization) {
        return this.restangular
            .all('admin-events')
            .delete();
    }

    getAdminEvents(queryParams?: URLSearchParams) {
        return this.restangular
            .all('admin-events')
            .get(queryParams)
            .map(response => response.json());
    }

}
