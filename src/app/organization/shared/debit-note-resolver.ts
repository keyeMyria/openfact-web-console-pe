import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { DebitNote } from '../../core/models/debit-note.model';
import { DataService } from '../../core/data/data.service';

@Injectable()
export class DebitNoteResolver implements Resolve<DebitNote>{

    constructor(private dataService: DataService) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<any> | Promise<any> {
        let organizationId = route.parent.parent.params['organization'];
        let organization = this.dataService.organizations().build(organizationId);

        let queryParams = new URLSearchParams();
        queryParams.set("includeXml", "true")

        return this.dataService.debitnotes().findById(organization, route.params['debitNote'], queryParams);
    }
}
