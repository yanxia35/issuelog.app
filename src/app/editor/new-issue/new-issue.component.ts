import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertifyService } from '../../_services/alertify.service';
import { EmployeeService } from '../../_services/employee.service';
import { AuthService } from '../../_services/auth.service';
import * as dateFormat from 'dateformat';
import { IssueService } from '../../_services/issue.service';
import { ProjectService } from '../../_services/project.service';
import { ProcessService } from '../../_services/process.service';
@Component({
  selector: 'app-new-issue',
  templateUrl: './new-issue.component.html',
  styleUrls: ['./new-issue.component.css']
})
export class NewIssueComponent implements OnInit {
  newIssueForm: FormGroup;
  employees: any;
  user: any;
  projects: any;
  processes: any;
  issueNoHistory: any[];
  isReadyToAdd = true;
  constructor(
    private fb: FormBuilder,
    private alertify: AlertifyService,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private issueService: IssueService,
    private projectService: ProjectService,
    private processService: ProcessService
  ) {}

  ngOnInit() {
    this.authService.currentUserAccount.subscribe(x => (this.user = x));
    this.getFormData();
    this.createForm();
    this.issueNoHistory = [];
  }

  getFormData() {
    this.employeeService.getEmployees();
    this.employeeService.employees.subscribe(res => {
      this.employees = res;
      // console.log(this.employees);
    });
    this.projectService.getProjects();
    this.projectService.projects.subscribe(res => {
      this.projects = res;
    });
    this.processService.getProcesses();
    this.processService.processes.subscribe(res => {
      this.processes = res;
    });
  }
  createForm() {
    this.newIssueForm = this.fb.group({
      originator: [''],
      owner: ['', [Validators.required]],
      projectNo: [''],
      project: [''],
      issueDescription: ['', [Validators.required]],
      foundInProcess: [27, [Validators.required]],
      issueStatus: ['active'],
      isMissingParts: [false]

    });
  }

  addNewIssue() {
    this.isReadyToAdd = false;
    const newIssue = {
      projectNo: this.newIssueForm.get('projectNo').value,
      project: this.newIssueForm.get('project').value,
      issueOwnerId: this.newIssueForm.get('owner').value,
      issueDescription: this.newIssueForm.get('issueDescription').value,
      issueNotes:
        this.user.username +
        ' ' +
        dateFormat(Date(), 'yyyy-mm-dd,h:MM TT') +
        '\n' +
        this.newIssueForm.get('issueDescription').value +
        '\n---------------------------',
      issueFoundProcessId: this.newIssueForm.get('foundInProcess').value,
      originatorId:
        this.user.id !== 'SU903'
          ? this.user.id
          : this.newIssueForm.get('originator').value,
      issueStatus: this.newIssueForm.get('issueStatus').value,
      isMissingParts: this.newIssueForm.get('isMissingParts').value
    };
    console.log(this.user.id);
    console.log(newIssue);
    this.issueService.addIssue(newIssue).subscribe(
      res => {
        // console.log(this.issueNoHistory);
        // console.log(res);
        this.issueNoHistory.push(res);
        this.issueService.addNewIssueIntoList(res);
        this.newIssueForm.get('issueDescription').setValue('');
        this.alertify.success('Successful');
        this.isReadyToAdd = true;
      },
      err => {
        this.alertify.error(err.message);
      }
    );
  }

  cancel() {
    this.newIssueForm.get('projectNo').setValue('');
    this.newIssueForm.get('project').setValue('');
    this.newIssueForm.get('owner').setValue('');
    this.newIssueForm.get('issueDescription').setValue('');
    this.newIssueForm.get('foundInProcess').setValue(27);
    this.newIssueForm.get('issueStatus').setValue('active');
  }
  isValid() {
    return (
      this.newIssueForm.valid &&
      (this.newIssueForm.get('projectNo').value !== '' ||
        this.newIssueForm.get('project').value !== '') &&
      (this.user.id !== 'SU903' ||
        this.newIssueForm.get('originator').value !== '')
    );
  }
}
