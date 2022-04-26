import { IssueService } from './issue.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AlertifyService } from './alertify.service';

@Injectable({
  providedIn: 'root'
})
export class SubscribeService {
  baseUrl = environment.apiUrl + 'subscriber/';

  constructor(private http: HttpClient, private alertify: AlertifyService, private issueService: IssueService) {}
  addSubscriber(subscriber: any) {
    return this.http.post(this.baseUrl + 'addsubscriber', subscriber).subscribe(
      res => {
        this.alertify.success('Subscribed!');
        this.issueService.addSubscriber(res);
      },
      error => {
        this.alertify.error(error.error);
      }
    );
  }
  deleteSubscriber(subscriber: any) {
    return this.http.post(this.baseUrl + 'deletesubscriber', subscriber).subscribe(
      res => {
        this.alertify.warning('Unsubscribed!');
        this.issueService.deleteSubscriber(subscriber);
      },
      error => {
        this.alertify.error(error.error);
      }
    );
  }
}
