import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../../_services/auth.service';
import { EmployeeService } from '../../_services/employee.service';
import { IssueActionService } from '../../_services/issue-action.service';
import * as dateFormat from 'dateformat';
import { IssueService } from '../../_services/issue.service';
import { AlertifyService } from '../../_services/alertify.service';

@Component({
  selector: 'app-action-editor',
  templateUrl: './action-editor.component.html',
  styleUrls: ['./action-editor.component.css']
})
export class ActionEditorComponent implements OnInit {
  user: any;
  actionEditorForm: FormGroup;
  action: any;
  employees: any;
  enableEditNotes = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private employeeService: EmployeeService,
    private actionService: IssueActionService,
    private issueService: IssueService,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    this.authService.currentUserAccount.subscribe(x => (this.user = x));
    this.employeeService.getEmployees();
    this.getEmployees();

    this.actionService.action.subscribe(res => {
      this.action = res;
      // console.log(this.action);
      this.createForm();
      this.actionEditorForm.get('newNotes').setValue('');
      this.updateActionForm();
      // this.alertify.success('Action Editor Ready');
    });
  }

  createForm() {
    this.actionEditorForm = this.fb.group({
      issueNo: [''],
      id: [''],
      createdById: [''],
      createdOn: [''],
      actionNotes: [''],
      newNotes: [''],
      responsibleId: [''],
      dueDate: [''],
      actionClosedDate: [''],
      issueNotes: [''],
      actionStatus: ['']
    });
  }

  getFormValue() {
    this.action.actionNotes = this.actionEditorForm.get('actionNotes').value;
    if (
      this.actionEditorForm.get('newNotes').value !== '' &&
      typeof this.actionEditorForm.get('newNotes').value !== 'undefined'
    ) {
      this.action.actionNotes =
        this.user.username +
        ' ' +
        dateFormat(Date(), 'yyyy-mm-dd,h:MM TT') +
        '\n' +
        this.actionEditorForm.get('newNotes').value +
        '\n---------------------------\n' +
        (this.action.actionNotes ? this.action.actionNotes : '');
    } else if (
      this.action.actionStatus !== 'closed' &&
      this.actionEditorForm.get('actionStatus').value === 'closed'
    ) {
      this.action.actionNotes =
        this.user.username +
        ' ' +
        dateFormat(Date(), 'yyyy-mm-dd,h:MM TT') +
        '\nAction Closed' +
        '\n---------------------------\n' +
        (this.action.actionNotes ? this.action.actionNotes : '');
    }
    this.action.actionStatus = this.actionEditorForm.get('actionStatus').value;
    this.action.responsibleId = this.actionEditorForm.get(
      'responsibleId'
    ).value;
    this.action.dueDate = this.convertToDate(
      this.actionEditorForm.get('dueDate').value
    );
  }

  getEmployees() {
    this.employeeService.employees.subscribe(res => {
      this.employees = res;
    });
  }

  updateActionForm() {
    if (!this.isEmpty(this.action)) {
      this.actionEditorForm.get('issueNo').setValue(this.action.issue.issueNo);
      this.actionEditorForm.get('id').setValue(this.action.id);
      this.actionEditorForm
        .get('createdById')
        .setValue(
          this.action.createdBy.firstName + ' ' + this.action.createdBy.lastName
        );
      this.actionEditorForm
        .get('createdOn')
        .setValue(dateFormat(this.action.createdOn, 'yyyy-mm-dd'));
      this.actionEditorForm
        .get('actionNotes')
        .setValue(this.action.actionNotes);
      this.actionEditorForm.get('newNotes').setValue(this.action.newNotes);
      this.actionEditorForm
        .get('responsibleId')
        .setValue(this.action.responsibleId);
      this.actionEditorForm
        .get('dueDate')
        .setValue(
          this.action.dueDate
            ? this.convertDateToObject(this.action.dueDate)
            : ''
        );
      this.actionEditorForm
        .get('actionClosedDate')
        .setValue(
          this.action.actionClosedDate
            ? dateFormat(this.action.actionClosedDate, 'yyyy-mm-dd')
            : ''
        );
      this.actionEditorForm
        .get('issueNotes')
        .setValue(this.action.issue.issueNotes);
      this.actionEditorForm
        .get('actionStatus')
        .setValue(this.action.actionStatus);
    }
  }

  cancelEdit() {
    this.actionService.selectAction(this.action.id);
  }

  saveAction() {
    this.getFormValue();
    this.actionService.saveAction(this.action);
  }
  toggleNotesEdit() {
    this.enableEditNotes = !this.enableEditNotes;
  }
  isEmpty(obj: any) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }
  convertToDate(date: any) {
    if (date !== '') {
      const dateReturn: Date = new Date(date.year, date.month - 1, date.day);
      return dateReturn;
    } else {
      return null;
    }
  }
  convertDateToObject(date: any) {
    date = new Date(date);
    // console.log(date);
    const dateReturn = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
    return dateReturn;
  }
  deleteAction() {
    if (this.user.id === this.action.createdById) {
      this.alertify.confirm('Delete this action', () => {
        this.actionService.deleteAction(this.action);
      },()=>{
        this.alertify.warning('Canceled');
      });
    } else {
      this.alertify.warning('This action is created by ' + this.employeeService.getEmployeeFullName(this.action.createdById)
      + '.\n Only this action\'s creator can delete!!' );
    }
  }

}
