import { Component, OnDestroy, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { AlertService } from './../core/alert/alert.service';
import { DataService } from './../core/data/data.service';
import { Organization } from './../core/model/organization.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'of-organization',
  templateUrl: './organization.component.html',
  styleUrls: []
})
export class OrganizationComponent implements OnInit, OnDestroy {

  dataSubscription: Subscription;

  organization: Organization;
  organizations: Array<Organization>;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.dataSubscription = this.route.data.subscribe(
      (data) => {
        this.organization = data['organization'];
      }
    );
    this.loadAllowedOrganizations();
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }

  loadAllowedOrganizations() {
    this.dataService.organizations().getAll().subscribe(
      (data) => {
        this.organizations = data;
      }
    );
  }

}
