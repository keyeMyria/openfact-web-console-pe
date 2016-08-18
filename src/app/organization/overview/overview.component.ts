import {Component, OnInit, Input} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {OrganizationModel} from '../../services';
import {Alert, AlertService} from '../../shared';

@Component({
  moduleId: module.id,
  selector: 'overview',
  templateUrl: 'overview.component.html',
  styleUrls: ['overview.component.css']
})
export class OverviewComponent implements OnInit {

  organization: OrganizationModel;

  alerts: Array<Alert> = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertMessageService: AlertService) {
    this.organization = this.activatedRoute.snapshot.parent.data['organization']  
  }

  ngOnInit() {
  }

}
