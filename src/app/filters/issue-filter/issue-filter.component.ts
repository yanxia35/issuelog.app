import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AlertifyService } from '../../_services/alertify.service';
import { EmployeeService } from '../../_services/employee.service';
import { ProjectService } from '../../_services/project.service';
import { IssueService } from '../../_services/issue.service';

@Component({
  selector: 'app-issue-filter',
  templateUrl: './issue-filter.component.html',
  styleUrls: ['./issue-filter.component.css']
})
export class IssueFilterComponent implements OnInit {
  filterForm: FormGroup;
  employees: any;
  projects: any;
  searchStatus: any;
  constructor(
    private fb: FormBuilder,
    private alertify: AlertifyService,
    private employeeService: EmployeeService,
    private projectService: ProjectService,
    private issueService: IssueService
  ) { }

  ngOnInit() {
    this.createForm();
    this.employeeService.getEmployees();
    this.getEmployees();
    this.projectService.getProjects();
    this.getProjects();
    this.projectService.getSubProjects();
    this.hookIssueSearchStatus();
  }
  getEmployees() {
    this.employeeService.employees.subscribe(res => {
      this.employees = res;
      // console.log(this.employees);
    });
  }
  hookIssueSearchStatus() {
    this.issueService.searchStatusOb.subscribe(res => {
      this.searchStatus = res;
    });
  }

  getProjects() {
    this.projectService.projects.subscribe(res => {
      this.projects = res;
    });
  }

  createForm() {
    this.filterForm = this.fb.group({
      status: ['active'],
      owner: [''],
      projectNo: [''],
      actionOwner: [''],
      issueNotes: [''],
      issueNo: ['']

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
      issueStatus: this.filterForm.get('status').value,
      issueOwner: this.filterForm.get('owner').value,
      actionOwner: this.filterForm.get('actionOwner').value,
      actionStatus: this.filterForm.get('actionOwner').value == ''? '':'active',
      issueNotes: this.filterForm.get('issueNotes').value,
      projectNo: this.filterForm.get('projectNo').value,
      issueNo: this.filterForm.get('issueNo').value,
      isMissingParts: 0,
      isReady: 0,
    };
    console.log(searchValues);
    this.issueService.searchIssues(searchValues);
    this.issueService.toggleEditor('clear');
  }

  clearFilter() {
    this.filterForm.get('status').setValue('active');
    this.filterForm.get('owner').setValue('');
    this.filterForm.get('actionOwner').setValue('');
    this.filterForm.get('issueNotes').setValue('');
    this.filterForm.get('projectNo').setValue('');
    this.filterForm.get('issueNo').setValue('');
    this.issueService.toggleEditor('clear');
  }
}
