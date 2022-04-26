import { environment } from './../../../environments/environment.prod';
import { IssueActionService } from './../../_services/issue-action.service';
import { IssueFileService } from './../../_services/issue-file.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IssueService } from '../../_services/issue.service';
import { AuthService } from '../../_services/auth.service';
import * as dateFormat from 'dateformat';
import { EmployeeService } from '../../_services/employee.service';
import { ProjectService } from '../../_services/project.service';
import { ProcessService } from '../../_services/process.service';
import { FailureModeService } from '../../_services/failure-mode.service';
import { AlertifyService } from '../../_services/alertify.service';
import { Values } from '../../data/software-category'

@Component({
  selector: 'app-issue-editor',
  templateUrl: './issue-editor.component.html',
  styleUrls: ['./issue-editor.component.css']
})
export class IssueEditorComponent implements OnInit {
  enableEditNotes = false;
  employees: any;
  issue: any;
  user: any;
  projects: any;
  issueEditorForm: FormGroup;
  processes: any;
  failureModes: any;
  actionTemplateForm: FormGroup;
  softwareCategoryList = Values.SOFTWARE_CATEGORY;

  constructor(
    private fb: FormBuilder,
    private issueService: IssueService,
    private authService: AuthService,
    private employeeService: EmployeeService,
    private projectService: ProjectService,
    private processService: ProcessService,
    private failureModeService: FailureModeService,
    private alertify: AlertifyService,
    private issueFileService: IssueFileService,
    private actionService: IssueActionService
  ) { }

  ngOnInit() {
    this.getIssue();
    this.getFormData();
  }

  getFormData() {
    this.authService.currentUserAccount.subscribe(x => (this.user = x));
    this.projectService.getProjects();
    this.projectService.projects.subscribe(res => {
      this.projects = res;
    });
    this.employeeService.getEmployees();
    this.employeeService.employees.subscribe(res => {
      this.employees = res;
      // this.issueEditorForm.get('issueOwnerId').setValue('');
      // console.log(this.employees);
    });
    this.processService.getProcesses();
    this.processService.processes.subscribe(res => {
      this.processes = res;
    });
    this.failureModeService.getFailureMode();
    this.failureModeService.failureModes.subscribe(res => {
      this.failureModes = res;
      // this.issueEditorForm.get('failureMode').setValue('');
    });
  }

  getIssue() {
    this.issueService.issue.subscribe(res => {
      this.issue = res;
      this.createForm();
      if (!this.isEmpty(this.issue)) {
        this.updateForm();
        this.issueEditorForm.get('newNotes').setValue('');
        // console.log(res.id);
        if (res.id !== undefined) {
          this.issueFileService.getIssueFileById(res.id);
        }
        // this.alertify.success('Issue Editor Ready');
      }
    });
  }

  createForm() {
    this.actionTemplateForm = this.fb.group({
      actionTemplate: ['0']
    });
    this.issueEditorForm = this.fb.group({
      issueNo: [''],
      createdOn: [''],
      originatorId: [''],
      projectNo: [''],
      project: [''],
      issueStatus: [''],
      issueOwnerId: [''],
      isMissingParts: [false],
      issueDescription: [''],
      category: [''],
      issueNotes: [''],
      newNotes: [''],
      followUpDate: [''],
      issueFoundProcess: [''],
      rootCause: [''],
      softwareCategory:[''],
      failureMode: [''],
      issueClosedDate: [''],
      isReady: ['']
    });
  }

  updateForm() {
    if (!this.isEmpty(this.issue)) {
      // console.log(this.issue);
      this.issueEditorForm.get('issueNo').setValue(this.issue.issueNo);
      this.issueEditorForm
        .get('createdOn')
        .setValue(dateFormat(this.issue.createdOn, 'yyyy-mm-dd'));
      this.issueEditorForm
        .get('originatorId')
        .setValue(
          this.issue.originator
            ? this.issue.originator.firstName +
            ' ' +
            this.issue.originator.lastName
            : ''
        );
      //
      this.issueEditorForm.get('projectNo').setValue(this.issue.projectNo);
      this.issueEditorForm.get('project').setValue(this.issue.project);
      this.issueEditorForm.get('issueStatus').setValue(this.issue.issueStatus);
      this.issueEditorForm
        .get('issueOwnerId')
        .setValue(this.issue.issueOwnerId);
      this.issueEditorForm
        .get('issueDescription')
        .setValue(this.issue.issueDescription);
      this.issueEditorForm.get('issueNotes').setValue(this.issue.issueNotes);
      this.issueEditorForm
        .get('isMissingParts')
        .setValue(this.issue.isMissingParts);
      this.issueEditorForm.get('category').setValue(this.issue.category);
      this.issueEditorForm
        .get('followUpDate')
        .setValue(this.convertDateToObject(this.issue.followUpDate));
      this.issueEditorForm
        .get('issueFoundProcess')
        .setValue(this.issue.issueFoundProcessId);
      this.issueEditorForm
        .get('rootCause')
        .setValue(this.issue.rootCauseProcessId);
      this.issueEditorForm
        .get('failureMode')
        .setValue(this.issue.failureModeId);
      this.issueEditorForm
        .get('issueClosedDate')
        .setValue(
          this.issue.issueClosedDate
            ? dateFormat(this.issue.issueClosedDate, 'yyyy-mm-dd')
            : ''
        );
      this.issueEditorForm.get('softwareCategory').setValue(
        this.issue.softwareCategory
      );
      this.issueEditorForm
        .get('isReady')
        .setValue(this.issue.isReady
        );
    }
  }

  isSoftwareIssue(){
    const softwareRootCause = [31,14];
    if(this.issueEditorForm.get('rootCause').value && softwareRootCause.indexOf(Number(this.issueEditorForm.get('rootCause').value))!==-1){
      return true;
    }else{
      return false
    }
  }
  resetSoftwareCategory(){
    if(!this.isSoftwareIssue()){
        this.issueEditorForm.get('softwareCategory').setValue(null);
    }
  }

  getFormValue() {
    this.issue.projectNo = this.issueEditorForm.get('projectNo').value;
    this.issue.project = this.issueEditorForm.get('project').value;
    this.issue.softwareCategory = this.issueEditorForm.get('softwareCategory').value;
    this.issue.issueOwnerId = this.issueEditorForm.get('issueOwnerId').value;
    this.issue.issueDescription = this.issueEditorForm.get(
      'issueDescription'
    ).value;
    this.issue.followUpDate = this.convertToDate(
      this.issueEditorForm.get('followUpDate').value
    );
    this.issue.issueFoundProcessId = this.issueEditorForm.get(
      'issueFoundProcess'
    ).value;
    this.issue.rootCauseProcessId = this.issueEditorForm.get('rootCause').value;
    this.issue.failureModeId = this.issueEditorForm.get('failureMode').value;
    this.issue.issueNotes = this.issueEditorForm.get('issueNotes').value;
    this.issue.isMissingParts = this.issueEditorForm.get(
      'isMissingParts'
    ).value;
    this.issue.category = this.issueEditorForm.get('category').value;
    if (this.issueEditorForm.get('newNotes').value !== '') {
      this.issue.issueNotes =
        this.user.username +
        ' ' +
        dateFormat(Date(), 'yyyy-mm-dd,h:MM TT') +
        '\n' +
        this.issueEditorForm.get('newNotes').value +
        '\n---------------------------\n' +
        this.issue.issueNotes;
    } else if (
      this.issue.issueStatus !== 'closed' &&
      this.issueEditorForm.get('issueStatus').value === 'closed'
    ) {
      this.issue.issueNotes =
        this.user.username +
        ' ' +
        dateFormat(Date(), 'yyyy-mm-dd,h:MM TT') +
        '\nIssue Closed' +
        '\n---------------------------\n' +
        this.issue.issueNotes;
    }
    this.issue.issueStatus = this.issueEditorForm.get('issueStatus').value;
    this.issue.isReady = this.issueEditorForm.get('isReady').value;
    console.log(this.issue);
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
  saveIssue() {
    this.getFormValue();
    // console.log(this.issue);
    this.issueService.saveIssue(this.issue);

  }
  cancelEdit() {
    this.alertify.confirm('Discard all changes?', () => {
      this.issueService.selectIssue(this.issue.id);
    },()=>{
      this.alertify.warning('Canceled');
    });
  }
  convertToDate(date: any) {
    if (date != null) {
      const dateReturn: Date = new Date(date.year, date.month - 1, date.day);
      return dateReturn;
    } else {
      return '';
    }
  }
  convertDateToObject(date: any) {
    if (date != null) {
      date = new Date(date);
      const dateReturn = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      };
      return dateReturn;
    } else {
      return null;
    }
  }
  isValidSave() {
    if (
      this.issue.issueStatus !== 'closed' &&
      (this.issueEditorForm.get('issueStatus')
        ? this.issueEditorForm.get('issueStatus').value === 'closed'
        : false)
    ) {
      if (
        (this.issueEditorForm.get('rootCause')
          ? this.issueEditorForm.get('rootCause').value !== 27
          : false) &&
        (this.issueEditorForm.get('failureMode')
          ? this.issueEditorForm.get('failureMode').value !== 19
          : false)
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
  /**
   *@function addActionTemplate user click add actions button selection action template based on user input in selection
   */
  addActionTemplate() {
    const selection = Number(this.actionTemplateForm.get('actionTemplate').value);
    switch (selection) {
      case 1:
        console.log('action');
        this.createEcActions();
        break;
      default:
        console.log('do nothing');
    }

  }
  /**
   * create pre-defined ec actions
   * Action 1 for ec tracker
   * action 2 for kitters
   */
  createEcActions() {
    this.alertify.confirm('Have you released all the additional parts under the EC number: ' + this.issue.issueNo + '?', () => {
      const newDate = new Date(Date.now());
      newDate.setDate(newDate.getDate() + 30);

      console.log(newDate);
      // @ remove the the Adil action
      // const action1 = {
      //   createdById: this.user.id,
      //   issueId: this.issue.id,
      //   responsibleId: environment.ECTracker,
      //   dueDate: newDate,
      //   actionStatus: 'active',
      //   actionNotes: 'Track EC parts.'
      // };
      // this.actionService.addAction(action1, 0);

      const action2 = {
        createdById: this.user.id,
        issueId: this.issue.id,
        responsibleId: environment.receiver,
        actionStatus: 'active',
        actionNotes: 'Create the \"Red Bin\", receive items into the \"Red Bin\" and deliver the \"Red Bin\" to kitting when ready.'
      };
      this.actionService.addAction(action2, 0);
    },()=>{
      this.alertify.warning("Canceled!");
    });
  }
}
