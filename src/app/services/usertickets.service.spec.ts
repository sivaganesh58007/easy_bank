import { TestBed } from '@angular/core/testing';

import { UserticketsService } from './usertickets.service';

describe('UserticketsService', () => {
  let service: UserticketsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserticketsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
