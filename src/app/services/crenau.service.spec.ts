import { TestBed } from '@angular/core/testing';

import { CrenauService } from './crenau.service';

describe('CrenauService', () => {
  let service: CrenauService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrenauService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
