import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Organization } from '../../core/models/organization.model';
import { DataService } from '../../core/data/data.service';

@Injectable()
export class SettingsOrganizationResolver implements Resolve<Organization>{

    constructor(private dataService: DataService) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<any> | Promise<any> {       
        return this.dataService.organizations().findById(route.parent.parent.params['organization']);
    }
}