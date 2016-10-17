import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Organization } from '../../shared';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  private organization: Organization;

  constructor(private activatedRoute: ActivatedRoute) {
    this.organization = this.activatedRoute.snapshot.parent.data['organization'];
  }

  ngOnInit() {
  }

}
