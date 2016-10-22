import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared';

import { AboutComponent } from './about/about.component';

import { OrganizationsComponent } from './organizations/organizations.component';
import { CreateOrganizationComponent } from './organizations/create-organization/create-organization.component';
import { SearchOrganizationComponent } from './organizations/search-organization/search-organization.component';

import { ServerInfoComponent } from './server-info/server-info.component';
import { ServerInfoGeneralComponent } from './server-info/server-info-general/server-info-general.component';
import { ServerInfoProvidersComponent } from './server-info/server-info-providers/server-info-providers.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AdminRoutingModule,
        NgbModule.forRoot(),
        SharedModule
    ],
    declarations: [
        OrganizationsComponent,
        AboutComponent,
        CreateOrganizationComponent,
        SearchOrganizationComponent,
        ServerInfoComponent,
        ServerInfoGeneralComponent,
        ServerInfoProvidersComponent,
    ],
    providers: [

    ]
})
export class AdminModule { }
