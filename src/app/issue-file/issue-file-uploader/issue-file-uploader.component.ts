import { IssueService } from './../../_services/issue.service';
import { IssueFileService } from './../../_services/issue-file.service';
import { environment } from './../../../environments/environment';
import { Component, OnInit, Input } from '@angular/core';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload';
@Component({
  selector: 'app-issue-file-uploader',
  templateUrl: './issue-file-uploader.component.html',
  styleUrls: ['./issue-file-uploader.component.css']
})
export class IssueFileUploaderComponent implements OnInit {
  URL = environment.apiUrl + 'issuefile/addfile';
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  response: string;
  issueId: any;
  constructor(private issueFileService: IssueFileService, private issueService: IssueService) {

  }
  ngOnInit() {
    this.initializeUploader();
    this.issueService.issue.subscribe(res => {
      this.issueId = res.id;
      this.uploader.options.additionalParameter = {
        issueId: this.issueId
      };
    });
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.URL,
      isHTML5: true,
      removeAfterUpload: true,
      maxFileSize: 5000000,
      additionalParameter: {
        issueId: this.issueId
      },
    });
    this.uploader.onAfterAddingFile = file => {
      file.withCredentials = false;
    };
    this.hasBaseDropZoneOver = false;
    this.response = '';
    this.uploader.response.subscribe(res => {
      const issueFile = JSON.parse(res);
      this.response = res;
      this.issueFileService.addIssueFile(issueFile);
    });

  }
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

}
