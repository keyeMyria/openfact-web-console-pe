/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { KeycloakService } from './keycloak.service';

describe('KeycloakService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KeycloakService]
    });
  });

  it('should ...', inject([KeycloakService], (service: KeycloakService) => {
    expect(service).toBeTruthy();
  }));
});
