import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DataService } from '../../core/data/data.service';
import { AlertService } from '../../core/alert/alert.service';
import { Organization } from '../../core/models/organization.model';

@Component({
  selector: 'of-organization-smtp-settings',
  templateUrl: './organization-smtp-settings.component.html',
  styleUrls: ['./organization-smtp-settings.component.scss']
})
export class OrganizationSmtpSettingsComponent implements OnInit {

  private organization: Organization;

  private form: FormGroup;
  private working: boolean = false;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private alertService: AlertService) {
    this.activatedRoute.data.subscribe(result => {
      this.organization = <Organization>result['organization'];
    });
    this.buildForm();
    this.loadData();
  }

  ngOnInit() {
  }

  buildForm() {
    this.form = this.formBuilder.group({
      host: [undefined, Validators.compose([Validators.required, Validators.maxLength(150)])],
      port: [undefined, Validators.compose([Validators.maxLength(20)])],
      from: [undefined, Validators.compose([Validators.required, Validators.maxLength(150)])],
      ssl: [false, Validators.compose([Validators.required])],
      starttls: [false, Validators.compose([Validators.required])],
      auth: [false],
      smtpUsername: [undefined, Validators.compose([Validators.maxLength(150)])],
      smtpPassword: [undefined, Validators.compose([Validators.maxLength(150)])]
    });
  }

  loadData() {
    this.form.patchValue(this.organization.smtpServer || {});
    this.form.markAsPristine();
  }

  save(value: any) {
    this.working = true;

    this.organization.save({ organization: this.organization.organization, smtpServer: value }).subscribe(
      result => {
        this.working = false;
        this.form.markAsPristine();
        this.alertService.pop('success', 'Success', 'Your changes have been saved to the organization.');
      },
      error => {
        this.working = false;
        this.alertService.pop('error', 'Error', 'Your changes could not saved to the organization.');
      }
    );
  }

}