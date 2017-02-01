import { Component, OnDestroy, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { DataService } from './../../../../core/data/data.service';
import { FileUploader } from 'ng2-file-upload';
import { Organization } from './../../../../core/model/organization.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'of-credit-note-upload',
  templateUrl: './credit-note-upload.component.html',
  styles: []
})
export class CreditNoteUploadComponent implements OnInit, OnDestroy {

  dataSubscription: Subscription;

  organization: Organization;

  uploader: FileUploader;
  hasDropZoneOver: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataService: DataService) { }

  ngOnInit() {
    this.dataSubscription = this.activatedRoute.parent.data.subscribe(data => {
      this.organization = data['organization'];
    });
    this.uploader = this.dataService.creditNotes().getFileUpload(this.organization);
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }

  fileOver(event: any): void {
    this.hasDropZoneOver = event;
  }

}
