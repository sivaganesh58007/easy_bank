import { TestBed } from '@angular/core/testing';

import { AdminticketsService } from './admintickets.service';

describe('AdminticketsService', () => {
  let service: AdminticketsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminticketsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
