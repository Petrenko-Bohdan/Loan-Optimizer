import { TestBed } from '@angular/core/testing';

import { LoanOptimizerService } from './loan-optimizer.service';

describe('LoanOptimizerService', () => {
  let service: LoanOptimizerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanOptimizerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
