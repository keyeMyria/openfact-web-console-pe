import { Component, OnDestroy, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { AlertService } from './../../../../core/alert/alert.service';
import { DataService } from './../../../../core/data/data.service';
import { Document } from './../../../../core/model/document.model';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'of-perception-edit-overview',
  templateUrl: './perception-edit-overview.component.html',
  styles: []
})
export class PerceptionEditOverviewComponent implements OnInit, OnDestroy {

  dataSubscription: Subscription;

  document: Document;
  documentJson: Observable<any>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private alertService: AlertService) {
  }

  ngOnInit() {
    this.dataSubscription = this.activatedRoute.parent.data.subscribe(data => {
      this.document = data['document'];
      this.document.getJsonRepresentation().subscribe(data => {
        this.documentJson = data;
      });
    });
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }

}
