import { EmployeeService } from './../../_services/employee.service';
import { AuthService } from './../../_services/auth.service';
import { IssueService } from './../../_services/issue.service';
import { AlertifyService } from './../../_services/alertify.service';
import { PartIssueService } from './../../_services/part-issue.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-flag-part-post',
  templateUrl: './flag-part-post.component.html',
  styleUrls: ['./flag-part-post.component.css']
})
export class FlagPartPostComponent implements OnInit {
  @Input() partIssue: any;
  user: any;
  employees: any;
  constructor(
    private partIssueService: PartIssueService,
    private alertify: AlertifyService,
    private issueService: IssueService,
    private authService: AuthService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    this.authService.currentUserAccount.subscribe(res => {
      this.user = res;
    });
    this.employeeService.employees.subscribe(res => {
      this.employees = res;
    });
  }
  resolveFlag() {
    this.partIssue.isResolved = true;
    this.partIssue.resolvedBy = this.user.id;
    this.partIssueService.resolveFlag(this.partIssue).subscribe(
      res => {
        this.alertify.success('Successful');
        this.issueService.updateFlagPart(res);
      },
      error => {
        this.alertify.error('Failed to resolve!');
      }
    );
  }
  reopenFlag() {
    this.partIssue.isResolved = false;
    this.partIssueService.reopenFlag(this.partIssue).subscribe(
      res => {
        this.alertify.success('Successful');
        this.issueService.updateFlagPart(res);
      },
      error => {
        this.alertify.error('Failed to reopen!');
      }
    );
  }
  deleteFlag() {
    this.alertify.confirm('Do you want to delete the flag?', () => {
      this.deleteFlagCall();
    },()=>{
      this.alertify.warning('Canceled');
    });
  }
  deleteFlagCall() {
    this.partIssueService.deleteFlag(this.partIssue).subscribe(res => {
      if (res !== 0) {
        this.alertify.success('Successful');
        this.issueService.RemoveFlagPartFromIssue(this.partIssue);
      } else {
        this.alertify.success('Failed to delete!');
      }
    });
  }
  getShortName() {
    if (this.partIssue.resolvedBy === 'SU903') {
      return 'shuser';
    }
    const index = this.employees.findIndex(
      x => x.id === this.partIssue.resolvedBy
    );
    if (index > -1) {
      return this.employees[index].shortName;
    } else {
      return this.partIssue.resolvedBy;
    }
  }
}
