import { TestBed } from '@angular/core/testing';

import { DepositWithdrawService } from './deposit-withraw.service';

describe('DepositWithrawService', () => {
  let service: DepositWithdrawService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepositWithdrawService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
