/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { IssueFileService } from './issue-file.service';

describe('Service: IssueFile', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IssueFileService]
    });
  });

  it('should ...', inject([IssueFileService], (service: IssueFileService) => {
    expect(service).toBeTruthy();
  }));
});
