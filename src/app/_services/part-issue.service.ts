import { Injectable } from '@angular/core';
import { AlertifyService } from './alertify.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PartIssueService {
  baseUrl = environment.apiUrl + 'partissue/';
  constructor(private http: HttpClient, private alertify: AlertifyService) {}
  flag(partIssue: any) {
    return this.http.post(this.baseUrl + 'flag', partIssue);
  }
  resolveFlag(partIssue: any) {
    // console.log(partIssue);
    return this.http.post(this.baseUrl + 'resolveflag', partIssue);
  }
  reopenFlag(partIssue: any) {
    // console.log(partIssue);
    return this.http.post(this.baseUrl + 'reopen', partIssue);
  }
  deleteFlag(partIssue: any) {
    // console.log(partIssue);
    return this.http.post(this.baseUrl + 'deleteflag', partIssue);
  }
}
