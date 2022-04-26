import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AlertifyService } from './alertify.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FailureModeService {
  private failureModeDate = new BehaviorSubject<any[]>([]);
  failureModes = this.failureModeDate.asObservable();
  baseUrl = environment.apiUrl + 'failureMode/';

  constructor(private http: HttpClient, private alertify: AlertifyService) { }

  getFailureMode() {
    if (this.failureModeDate.value.length === 0) {
      this.http.get(this.baseUrl).subscribe((res: any[]) => {
        this.failureModeDate.next(res);
      }, (error: any) => {
        this.alertify.error('Failed to load employees!');
      });
    }
  }
}
