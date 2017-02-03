import { DocumentosRelacionadosPercepcionResolverService, DocumentosRelacionadosRetencionResolverService, IgvResolverService, MonedasResolverService, TiposAfectacionIGVResolverService, TiposComprobantePagoResolverService, TiposDocumentoEntidadResolverService, TiposNotaCreditoResolverService, TiposNotaDebitoResolverService, TiposRegimenPercepcionResolverService, TiposRegimenRetencionResolverService } from './../core/resolvers/generic-type-resolver.service';
import { RouterModule, Routes } from '@angular/router';

import { CreditNoteCreateComponent } from './documents/credit-notes/credit-note-create/credit-note-create.component';
import { CreditNoteEditComponent } from './documents/credit-notes/credit-note-edit/credit-note-edit.component';
import { CreditNoteEditOverviewComponent } from './documents/credit-notes/credit-note-edit-overview/credit-note-edit-overview.component';
import { CreditNoteListComponent } from './documents/credit-notes/credit-note-list/credit-note-list.component';
import { CreditNoteUploadComponent } from './documents/credit-notes/credit-note-upload/credit-note-upload.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DebitNoteCreateComponent } from './documents/debit-notes/debit-note-create/debit-note-create.component';
import { DebitNoteEditComponent } from './documents/debit-notes/debit-note-edit/debit-note-edit.component';
import { DebitNoteEditOverviewComponent } from './documents/debit-notes/debit-note-edit-overview/debit-note-edit-overview.component';
import { DebitNoteListComponent } from './documents/debit-notes/debit-note-list/debit-note-list.component';
import { DebitNoteUploadComponent } from './documents/debit-notes/debit-note-upload/debit-note-upload.component';
import { DocumentAttachedDocumentsComponent } from './documents/document-attached-documents/document-attached-documents.component';
import { DocumentResolverService } from './../core/resolvers/document-resolver.service';
import { DocumentSendEventsComponent } from './documents/document-send-events/document-send-events.component';
import { InvoiceCreateComponent } from './documents/invoices/invoice-create/invoice-create.component';
import { InvoiceEditComponent } from './documents/invoices/invoice-edit/invoice-edit.component';
import { InvoiceEditOverviewComponent } from './documents/invoices/invoice-edit-overview/invoice-edit-overview.component';
import { InvoiceListComponent } from './documents/invoices/invoice-list/invoice-list.component';
import { InvoiceUploadComponent } from './documents/invoices/invoice-upload/invoice-upload.component';
import { NgModule } from '@angular/core';
import { OrganizationComponent } from './organization.component';
import { OrganizationComponentResolverService } from './../core/resolvers/organization-component-resolver.service';
import { OrganizationKeyResolverService } from './../core/resolvers/organization-key-resolver.service';
import { OrganizationResolverService } from './../core/resolvers/organization-resolver.service';
import { PerceptionCreateComponent } from './documents/perceptions/perception-create/perception-create.component';
import { PerceptionEditComponent } from './documents/perceptions/perception-edit/perception-edit.component';
import { PerceptionEditOverviewComponent } from './documents/perceptions/perception-edit-overview/perception-edit-overview.component';
import { PerceptionListComponent } from './documents/perceptions/perception-list/perception-list.component';
import { PerceptionUploadComponent } from './documents/perceptions/perception-upload/perception-upload.component';
import { RetentionCreateComponent } from './documents/retentions/retention-create/retention-create.component';
import { RetentionEditComponent } from './documents/retentions/retention-edit/retention-edit.component';
import { RetentionEditOverviewComponent } from './documents/retentions/retention-edit-overview/retention-edit-overview.component';
import { RetentionListComponent } from './documents/retentions/retention-list/retention-list.component';
import { RetentionUploadComponent } from './documents/retentions/retention-upload/retention-upload.component';
import { ServerInfoResolverService } from './../core/resolvers/server-info-resolver.service';
import { SettingsActiveKeyComponent } from './settings/settings-active-key/settings-active-key.component';
import { SettingsAdditionalInformationComponent } from './settings/settings-additional-information/settings-additional-information.component';
import { SettingsAllKeysComponent } from './settings/settings-all-keys/settings-all-keys.component';
import { SettingsGeneralInformationComponent } from './settings/settings-general-information/settings-general-information.component';
import { SettingsGenericKeystoreComponent } from './settings/settings-generic-keystore/settings-generic-keystore.component';
import { SettingsKeyProvidersComponent } from './settings/settings-key-providers/settings-key-providers.component';
import { SettingsSmtpComponent } from './settings/settings-smtp/settings-smtp.component';
import { SettingsTasksComponent } from './settings/settings-tasks/settings-tasks.component';
import { SettingsThemeComponent } from './settings/settings-theme/settings-theme.component';
import { VoidedDocumentCreateComponent } from './documents/voided-document/voided-document-create/voided-document-create.component';
import { VoidedDocumentEditComponent } from './documents/voided-document/voided-document-edit/voided-document-edit.component';
import { VoidedDocumentEditOverviewComponent } from './documents/voided-document/voided-document-edit-overview/voided-document-edit-overview.component';
import { VoidedDocumentListComponent } from './documents/voided-document/voided-document-list/voided-document-list.component';
import { VoidedDocumentUploadComponent } from './documents/voided-document/voided-document-upload/voided-document-upload.component';

const routes: Routes = [
  {
    path: '',
    component: OrganizationComponent,
    resolve: {
      organization: OrganizationResolverService
    },
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'settings/general-information',
        component: SettingsGeneralInformationComponent,
        resolve: {
          organization: OrganizationResolverService
        }
      },
      {
        path: 'settings/additional-information',
        component: SettingsAdditionalInformationComponent,
        resolve: {
          organization: OrganizationResolverService
        }
      },
      {
        path: 'settings/smtp-settings',
        component: SettingsSmtpComponent,
        resolve: {
          organization: OrganizationResolverService
        }
      },
      {
        path: 'settings/theme-settings',
        component: SettingsThemeComponent,
        resolve: {
          organization: OrganizationResolverService,
          serverInfo: ServerInfoResolverService
        }
      },
      {
        path: 'settings/tasks-settings',
        component: SettingsTasksComponent,
        resolve: {
          organization: OrganizationResolverService
        }
      },
      {
        path: 'settings/keys',
        component: SettingsActiveKeyComponent,
        resolve: {
          organization: OrganizationResolverService,
          keys: OrganizationKeyResolverService
        }
      },
      {
        path: 'settings/keys/list',
        component: SettingsAllKeysComponent,
        resolve: {
          organization: OrganizationResolverService,
          keys: OrganizationKeyResolverService
        }
      },
      {
        path: 'settings/keys/providers',
        component: SettingsKeyProvidersComponent,
        resolve: {
          organization: OrganizationResolverService,
          serverInfo: ServerInfoResolverService
        }
      },
      {
        path: 'settings/keys/providers/:provider',
        component: SettingsGenericKeystoreComponent,
        resolve: {
          organization: OrganizationResolverService,
          serverInfo: ServerInfoResolverService
        }
      },
      {
        path: 'settings/keys/providers/:provider/:component',
        component: SettingsGenericKeystoreComponent,
        resolve: {
          organization: OrganizationResolverService,
          serverInfo: ServerInfoResolverService,
          instance: OrganizationComponentResolverService
        }
      },
      {
        path: 'invoices',
        component: InvoiceListComponent
      },
      {
        path: 'invoices/create',
        component: InvoiceCreateComponent,
        resolve: {
          tiposComprobantePago: TiposComprobantePagoResolverService,
          tiposDocumentEntidad: TiposDocumentoEntidadResolverService,
          tiposDeAfectacionIgv: TiposAfectacionIGVResolverService,
          igv: IgvResolverService
        }
      },
      {
        path: 'invoices/upload',
        component: InvoiceUploadComponent
      },
      {
        path: 'invoices/:document',
        component: InvoiceEditComponent,
        resolve: {
          document: DocumentResolverService
        },
        children: [
          {
            path: '',
            component: InvoiceEditOverviewComponent
          },
          {
            path: 'send-events',
            component: DocumentSendEventsComponent
          },
          {
            path: 'attached-documents',
            component: DocumentAttachedDocumentsComponent
          }
        ]
      },
      {
        path: 'credit-notes',
        component: CreditNoteListComponent
      },
      {
        path: 'credit-notes/create',
        component: CreditNoteCreateComponent,
        resolve: {
          tiposNotaCredito: TiposNotaCreditoResolverService,
          tiposDocumentEntidad: TiposDocumentoEntidadResolverService,
          tiposDeAfectacionIgv: TiposAfectacionIGVResolverService,
          igv: IgvResolverService
        }
      },
      {
        path: 'credit-notes/upload',
        component: CreditNoteUploadComponent
      },
      {
        path: 'credit-notes/:document',
        component: CreditNoteEditComponent,
        resolve: {
          document: DocumentResolverService
        },
        children: [
          {
            path: '',
            component: CreditNoteEditOverviewComponent
          },
          {
            path: 'send-events',
            component: DocumentSendEventsComponent
          },
          {
            path: 'attached-documents',
            component: DocumentAttachedDocumentsComponent
          }
        ]
      },
      {
        path: 'debit-notes',
        component: DebitNoteListComponent
      },
      {
        path: 'debit-notes/create',
        component: DebitNoteCreateComponent,
        resolve: {
          tiposNotaDebito: TiposNotaDebitoResolverService,
          tiposDocumentEntidad: TiposDocumentoEntidadResolverService,
          tiposDeAfectacionIgv: TiposAfectacionIGVResolverService,
          igv: IgvResolverService
        }
      },
      {
        path: 'debit-notes/upload',
        component: DebitNoteUploadComponent
      },
      {
        path: 'debit-notes/:document',
        component: DebitNoteEditComponent,
        resolve: {
          document: DocumentResolverService
        },
        children: [
          {
            path: '',
            component: DebitNoteEditOverviewComponent
          },
          {
            path: 'send-events',
            component: DocumentSendEventsComponent
          },
          {
            path: 'attached-documents',
            component: DocumentAttachedDocumentsComponent
          }
        ]
      },
      {
        path: 'perceptions',
        component: PerceptionListComponent
      },
      {
        path: 'perceptions/create',
        component: PerceptionCreateComponent,
        resolve: {
          tiposRegimenPercepcion: TiposRegimenPercepcionResolverService,
          documentosRelacionadosPercepcion: DocumentosRelacionadosPercepcionResolverService,
          tiposDocumentEntidad: TiposDocumentoEntidadResolverService,
          monedas: MonedasResolverService
        }
      },
      {
        path: 'perceptions/upload',
        component: PerceptionUploadComponent
      },
      {
        path: 'perceptions/:document',
        component: PerceptionEditComponent,
        resolve: {
          document: DocumentResolverService
        },
        children: [
          {
            path: '',
            component: PerceptionEditOverviewComponent
          },
          {
            path: 'send-events',
            component: DocumentSendEventsComponent
          },
          {
            path: 'attached-documents',
            component: DocumentAttachedDocumentsComponent
          }
        ]
      },
      {
        path: 'retentions',
        component: RetentionListComponent
      },
      {
        path: 'retentions/create',
        component: RetentionCreateComponent,
        resolve: {
          tiposRegimenRetencion: TiposRegimenRetencionResolverService,
          documentosRelacionadosRetencion: DocumentosRelacionadosRetencionResolverService,
          tiposDocumentEntidad: TiposDocumentoEntidadResolverService,
          monedas: MonedasResolverService
        }
      },
      {
        path: 'retentions/upload',
        component: RetentionUploadComponent
      },
      {
        path: 'retentions/:document',
        component: RetentionEditComponent,
        resolve: {
          document: DocumentResolverService
        },
        children: [
          {
            path: '',
            component: RetentionEditOverviewComponent
          },
          {
            path: 'send-events',
            component: DocumentSendEventsComponent
          },
          {
            path: 'attached-documents',
            component: DocumentAttachedDocumentsComponent
          }
        ]
      },
      {
        path: 'voided-documents',
        component: VoidedDocumentListComponent
      },
      {
        path: 'voided-documents/create',
        component: VoidedDocumentCreateComponent,
        // resolve: {
        //   tiposRegimenRetencion: TiposRegimenRetencionResolverService,
        //   documentosRelacionadosRetencion: DocumentosRelacionadosRetencionResolverService,
        //   tiposDocumentEntidad: TiposDocumentoEntidadResolverService,
        //   monedas: MonedasResolverService
        // }
      },
      {
        path: 'voided-documents/upload',
        component: VoidedDocumentUploadComponent
      },
      {
        path: 'voided-documents/:document',
        component: VoidedDocumentEditComponent,
        resolve: {
          document: DocumentResolverService
        },
        children: [
          {
            path: '',
            component: VoidedDocumentEditOverviewComponent
          },
          {
            path: 'send-events',
            component: DocumentSendEventsComponent
          },
          {
            path: 'attached-documents',
            component: DocumentAttachedDocumentsComponent
          }
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class OrganizationRoutingModule { }
