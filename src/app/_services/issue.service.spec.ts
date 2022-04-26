/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { IssueService } from './issue.service';

describe('Service: Issues', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IssueService]
    });
  });

  it('should ...', inject([IssueService], (service: IssueService) => {
    expect(service).toBeTruthy();
  }));
});
