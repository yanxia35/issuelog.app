/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { SubscribeService } from './subscribe.service';

describe('Service: Subscribe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubscribeService]
    });
  });

  it('should ...', inject([SubscribeService], (service: SubscribeService) => {
    expect(service).toBeTruthy();
  }));
});
