/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { FailureModeService } from './failure-mode.service';

describe('Service: FailureMode', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FailureModeService]
    });
  });

  it('should ...', inject([FailureModeService], (service: FailureModeService) => {
    expect(service).toBeTruthy();
  }));
});
