import { Component, OnInit } from '@angular/core';
import { IssueService } from '../../_services/issue.service';

@Component({
  selector: 'app-issue-posts',
  templateUrl: './issue-posts.component.html',
  styleUrls: ['./issue-posts.component.css']
})
export class IssuePostsComponent implements OnInit {
  display = false;
  issues: any;
  issueSummary : any;
  searchStatus: any;

  constructor(private issueService: IssueService) { }

  ngOnInit() {
    this.issueService.issueList.subscribe(res => {
      this.issues = res;
    });
    this.issueService.issueSummary.subscribe(issuesum => {
      this.issueSummary = issuesum;         // get number of issues from issueSummary Oberservable, then display in the HTML
    });
    this.issueService.searchStatusOb.subscribe(res => {
      this.searchStatus = res;              // get the search status, so the summary bar will be hided in searching process
    });
  }


}
