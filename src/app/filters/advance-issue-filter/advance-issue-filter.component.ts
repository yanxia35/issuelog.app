import { ProcessService } from './../../_services/process.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { EmployeeService } from 'src/app/_services/employee.service';
import { ProjectService } from 'src/app/_services/project.service';
import { IssueService } from 'src/app/_services/issue.service';

@Component({
  selector: 'app-advance-issue-filter',
  templateUrl: './advance-issue-filter.component.html',
  styleUrls: ['./advance-issue-filter.component.css']
})
export class AdvanceIssueFilterComponent implements OnInit {
  filterForm: FormGroup;
  employees: any;
  projects: any;
  searchStatus: any;
  processes: any;
  constructor(
    private fb: FormBuilder,
    private alertify: AlertifyService,
    private employeeService: EmployeeService,
    private projectService: ProjectService,
    private issueService: IssueService,
    private processService: ProcessService
  ) { }

  ngOnInit() {
    this.createForm();
    this.hookOptions();
  }
  hookOptions() {
    this.employeeService.getEmployees();
    this.processService.getProcesses();
    this.projectService.getProjects();
    this.employeeService.employees.subscribe(res => {
      this.employees = res;
      // console.log(this.employees);
    });
    this.issueService.searchStatusOb.subscribe(res => {
      this.searchStatus = res;
    });
    this.processService.processes.subscribe(res => {
      this.processes = res;
    });
    this.projectService.projects.subscribe(res => {
      this.projects = res;
    });
  }

  createForm() {
    this.filterForm = this.fb.group({
      originator: [''],
      status: ['active'],
      owner: [''],
      projectNo: [''],
      actionOwner: [''],
      issueNotes: [''],
      issueNo: [''],
      rootCauseProcess: [''],
      ownerDepartment: [''],
      isMissingParts: [0],
      isReady: [0],
      actionStatus:[''],
      isActionLate:[0],
      isMissingDueDate:[0],
      actionDueDateMoreThan:[0,Validators.pattern('[0-9]')],
      actionOwnerDept:['']
    });
  }

  notify() {
    if (this.filterForm.get('issueNotes').value) {
      this.alertify.success('success');
    } else {
      this.alertify.error('fail');
    }
    // this.alertify.success(this.filterForm.get('status').value);
  }
  searchIssues() {
    const searchValues = {
      originator:this.filterForm.get('originator').value,
      issueStatus: this.filterForm.get('status').value,
      issueOwner: this.filterForm.get('owner').value,
      actionOwner: this.filterForm.get('actionOwner').value,
      issueNotes: this.filterForm.get('issueNotes').value,
      projectNo: this.filterForm.get('projectNo').value,
      issueNo: this.filterForm.get('issueNo').value,
      rootCauseProcess: this.filterForm.get('rootCauseProcess').value ? this.filterForm.get('rootCauseProcess').value : 0,
      ownerDepartment: this.filterForm.get('ownerDepartment').value,
      isMissingParts: this.filterForm.get('isMissingParts').value,
      isReady: this.filterForm.get('isReady').value,
      actionStatus: this.filterForm.get('actionStatus').value,
      isActionLate: this.filterForm.get('isActionLate').value,
      isMissingDueDate: this.filterForm.get('isMissingDueDate').value,
      actionDueDateMoreThan: this.filterForm.get('actionDueDateMoreThan').value,
      actionOwnerDept: this.filterForm.get('actionOwnerDept').value

    };
    console.log(searchValues);
    this.issueService.searchIssues(searchValues);
  }

  clearFilter() {
    this.filterForm.get('originator').setValue('');
    this.filterForm.get('status').setValue('active');
    this.filterForm.get('owner').setValue('');
    this.filterForm.get('actionOwner').setValue('');
    this.filterForm.get('issueNotes').setValue('');
    this.filterForm.get('projectNo').setValue('');
    this.filterForm.get('issueNo').setValue('');
    this.filterForm.get('rootCauseProcess').setValue('');
    this.filterForm.get('ownerDepartment').setValue('');
    this.filterForm.get('isMissingParts').setValue(0);
    this.filterForm.get('actionStatus').setValue('all');
    this.filterForm.get('isMissingDueDate').setValue(0);
    this.filterForm.get('isActionLate').setValue(0);
    this.filterForm.get('actionDueDateMoreThan').setValue(0);
    this.filterForm.get('actionOwnerDept').setValue('');
  }

}
