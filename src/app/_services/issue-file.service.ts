import { AlertifyService } from './alertify.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IssueFileService {
  baseUrl = environment.apiUrl + 'issuefile/';
  private issueFileData = new BehaviorSubject<any[]>([]);
  issueFileList = this.issueFileData.asObservable();
  constructor(private http: HttpClient, private alertify: AlertifyService) { }

  public addIssueFile(issueFile: any) {
    const issueFileList = this.issueFileData.value;
    issueFileList.push(issueFile);
    this.issueFileData.next(issueFileList);
  }
  getIssueFileById(issueId: any) {
    this.http.get(this.baseUrl + 'getissuefilebyid/' + issueId).subscribe((res: any[]) => {
      this.issueFileData.next(res);
      // console.log(res);
    }, error => {
      this.alertify.error(error.error);
    });
  }
  deleteIssueFile(id: any) {
    this.http.get(this.baseUrl + 'deleteissuefile/' + id).subscribe((res) => {
      if (res) {
        const issueFileList = this.issueFileData.value;
        const index = issueFileList.findIndex(p => p.id === id);
        issueFileList.splice(index, 1);
        this.issueFileData.next(issueFileList);
        this.alertify.success('Successful!');
      } else {
        this.alertify.error('Failure to delete');
      }
    }, error => {
      console.log(error.error);
      this.alertify.error(error.error);
    });
  }

}
