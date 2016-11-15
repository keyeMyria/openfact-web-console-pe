import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Invoice } from '../../services/models/invoice';

@Component({
  selector: 'app-invoice-overview',
  templateUrl: './invoice-overview.component.html',
  styleUrls: ['./invoice-overview.component.scss']
})
export class InvoiceOverviewComponent implements OnInit {

  private invoice: Invoice;

  constructor(private activatedRoute: ActivatedRoute) {
    this.invoice = this.activatedRoute.snapshot.data['invoice'];
  }

  ngOnInit() {
  }

}
