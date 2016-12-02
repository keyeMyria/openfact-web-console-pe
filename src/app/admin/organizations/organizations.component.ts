import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { DataService } from '../../core/data/data.service';
import { AlertService } from '../../core/alert/alert.service';
import { Organization } from '../../core/models/organization.model';

@Component({
  selector: 'of-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.scss']
})
export class OrganizationsComponent implements OnInit {

  searchResult: Array<Organization> = new Array<Organization>();
  filters = {
    filterText: undefined
  };

  constructor(
    private router: Router,
    private dataService: DataService,
    private alertService: AlertService) {
    this.search();
  }

  ngOnInit() {
  }

  editOrganization(organization: Organization) {
    this.router.navigate(['/organizations', organization.organization]);
  }

  search() {
    this.dataService.organizations().getAll().subscribe(
      result => {
        this.searchResult = result;
      }, error => {
        this.alertService.pop('error', 'Error', 'Error loading projects.');
      });
  }

}
