import {
  Router,
  ActivatedRoute
} from '@angular/router';
import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { IssueService } from '../_services/issue.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  issue: any;
  editor: any;
  searchStatus: any;
  baseUrl = environment.baseUrl;
  issueNo: any;
  showAdvanceSearch = false;
  constructor(
    private issueService: IssueService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.issueService.issue.subscribe(res => {
      this.issue = res;
    });
    this.issueService.editorSelector.subscribe(a => {
      this.editor = a;
    });
    this.issueService.searchStatusOb.subscribe(res => {
      this.searchStatus = res;
    });
    console.log(this.route.snapshot.paramMap.get('issueNo'));
    if (this.route.snapshot.paramMap.get('issueNo')) {
      const filter = {
        issueNo: this.route.snapshot.paramMap.get('issueNo')
      };
      this.issueService.searchIssues(filter);
    }
  }

  isIssueSelected() {
    // console.log(this.issue);
    if (this.isEmpty(this.issue)) {
      return false;
    } else {
      return true;
    }
  }
  isEmpty(obj: any) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }
}
