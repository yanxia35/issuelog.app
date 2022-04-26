/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { IssueActionService } from './issue-action.service';

describe('Service: IssueAction', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IssueActionService]
    });
  });

  it('should ...', inject([IssueActionService], (service: IssueActionService) => {
    expect(service).toBeTruthy();
  }));
});
