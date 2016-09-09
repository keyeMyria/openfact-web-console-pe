import {Routes, RouterModule} from '@angular/router';

import {OrganizationResolve} from '../services';

import {OrganizationComponent} from './organization.component';
import {OverviewComponent} from './overview';
import {InvoicesComponent, CreateInvoiceComponent, ListInvoiceComponent, EditInvoiceComponent} from './invoices';
import {CreditNotesComponent, ListCreditNotesComponent, CreateCreditNoteComponent} from './credit-notes';
import {SettingsComponent, GeneralInformationComponent, AddressComponent, CertificateComponent, TasksScheduleComponent} from './settings';



const organizationRoutes: Routes = [
  {
    path: '',
    component: OrganizationComponent,
    resolve: {
      organization: OrganizationResolve
    },
    children: [
      {
        path: '',
        redirectTo: 'overview'
      },
      {
        path: 'overview',
        component: OverviewComponent
      },
      {
        path: 'invoices',
        component: InvoicesComponent,
        children: [
          {
            path: '',
            component: ListInvoiceComponent
          },
          {
            path: 'create-invoice',
            component: CreateInvoiceComponent

            // data: {
            //  permitidos roles: ['uno, 'dos'],
            //  no permitidis: 
            // }
          },
          {
            path: 'edit-invoice/:id',
            component: EditInvoiceComponent
          }
        ]
      },
      {
        path: 'credit-notes',
        component: CreditNotesComponent,
        children: [
          {
            path: '',
            component: ListCreditNotesComponent
          },
          {
            path: 'create-credit-note',
            component: CreateCreditNoteComponent

            // data: {
            //  permitidos roles: ['uno, 'dos'],
            //  no permitidis: 
            // }
          }
          //   {
          //     path: 'edit-invoice/:id',
          //     component: EditInvoiceComponent
          //   }
        ]
      },
      {
        path: 'settings',
        component: SettingsComponent,
        children: [
          {
            path: '',
            redirectTo: 'general-information'
          },
          {
            path: 'general-information',
            component: GeneralInformationComponent
          },
          {
            path: 'address',
            component: AddressComponent
          },
          /*{
            path: 'certificate',
            component: CertificateComponent
          },*/
          {
            path: 'tasks-schedule',
            component: TasksScheduleComponent
          }
        ]
      }
    ]
  }
];

export const organizationRouting = RouterModule.forChild(organizationRoutes);
