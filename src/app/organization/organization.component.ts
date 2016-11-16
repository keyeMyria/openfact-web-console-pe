import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataService } from '../core/data/data.service';
import { AlertService } from '../core/alert/alert.service';
import { Organization } from '../core/models/organization.model';

@Component({
    selector: 'app-organization',
    templateUrl: './organization.component.html',
    styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {

    private organization: Organization;
    private organizations: Array<Organization>;

    constructor(
        private activatedRoute: ActivatedRoute,
        private dataService: DataService,
        private alertService: AlertService) {
        this.activatedRoute.data.subscribe(result => {
            this.organization = <Organization>result['organization'];
        });
        this.loadAllowedOrganizations();
    }

    ngOnInit() {
    }

    loadAllowedOrganizations() {
        this.dataService.organizations().getAll().subscribe(
            result => {
                this.organizations = result;
            },
            error => {
                this.alertService.pop('error', 'Error', 'Could not loaded organizations.');
            }
        );
    }

}
