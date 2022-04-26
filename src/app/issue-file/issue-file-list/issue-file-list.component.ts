import { AlertifyService } from './../../_services/alertify.service';
import { IssueService } from './../../_services/issue.service';
import { environment } from './../../../environments/environment';
import { IssueFileService } from './../../_services/issue-file.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-issue-file-list',
  templateUrl: './issue-file-list.component.html',
  styleUrls: ['./issue-file-list.component.css']
})
export class IssueFileListComponent implements OnInit {
  issueFiles: any;
  issue: any;
  fileUrl = environment.fileUrl;

  constructor(
    private issueFileService: IssueFileService,
    private issueService: IssueService,
    private alertify: AlertifyService) {

  }

  ngOnInit() {
    this.issueFileService.issueFileList.subscribe(res => {
      this.issueFiles = res;
      // console.log(res);
    });
    this.issueService.issue.subscribe(res => {
      this.issue = res;
    });
  }
  delete(id: any) {
    this.alertify.confirm('Confirm deleting file?', () => {
      this.issueFileService.deleteIssueFile(id);
    },()=>{
      this.alertify.warning('Canceled');
    });
  }
}
