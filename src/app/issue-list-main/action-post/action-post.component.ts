import { AuthService } from './../../_services/auth.service';
import { IssueService } from './../../_services/issue.service';
import { IssueActionService } from './../../_services/issue-action.service';
import { Component, OnInit, Input } from '@angular/core';
import * as dateFormat from 'dateformat';

@Component({
  selector: 'app-action-post',
  templateUrl: './action-post.component.html',
  styleUrls: ['./action-post.component.css']
})
export class ActionPostComponent implements OnInit {
  @Input() action: any;
  user: any;
  edittingAction: any;
  currentEditor: any;
  constructor(
    private actionService: IssueActionService,
    private issueService: IssueService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.currentUserAccount.subscribe(res => {
      this.user = res;
    });
    this.actionService.action.subscribe(res => {
      this.edittingAction = res;
    });
    this.issueService.editorSelector.subscribe(res => {
      this.currentEditor = res;
    });
  }
  actionEdit(actionId: any) {
    console.log(actionId);
    this.actionService.selectAction(actionId);
    this.issueService.toggleEditor('action');
  }
  saveAction() {
    this.action.actionNotes= this.user.username +
        ' ' +
        dateFormat(Date(), 'yyyy-mm-dd,h:MM TT') +
        '\nAction Closed' +
        '\n---------------------------\n' +
        (this.action.actionNotes ? this.action.actionNotes : '');
    this.action.actionStatus = 'closed'
    if(this.action.dueDate ===null){
      this.action.dueDate = dateFormat(Date(),'yyyy-mm-dd')
    }
    this.actionService.saveAction(this.action);
  }

}
