import { Component, OnInit } from "@angular/core";
import { AlertifyService } from "src/app/_services/alertify.service";
import { IssueService } from "src/app/_services/issue.service";
import { ProjectService } from "src/app/_services/project.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { forkJoin } from "rxjs";

@Component({
  selector: "app-project-matrix",
  templateUrl: "./project-matrix.component.html",
  styleUrls: ["./project-matrix.component.scss"],
})
export class ProjectMatrixComponent implements OnInit {
  issueList: any;
  subProjects: any;
  projectId: any;
  searchedProjectId: any;
  issueStatus = "";
  searchStatus = false;
  filteredSubProjects:any;

  constructor(
    private alertify: AlertifyService,
    private issueService: IssueService,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    this.projectService.getSubProjects();
    this.issueService.issueList.subscribe((res) => {
      this.issueList = res.filter((x) => x.subProjectStatuses.length != 0);
      // this.filterSubProjects();
      // console.log(this.issueList);
    });
    this.projectService.subProjects.subscribe((res) => {
      this.subProjects = res;
      // this.filterSubProjects();
      // console.log(this.subProjects);
    });
    this.issueService.searchStatusOb.subscribe((res) => {
      this.searchStatus = res;
    });

  }
  filterSubProjects(){
    this.filteredSubProjects= this.subProjects.filter(res=>{
      res.mainProjectId === this.issueList[0].project
    });
  }

  searchIssue() {
    // const projectNoReg = RegExp("[0-9]{4}$");
    // if (projectNoReg.test(this.projectId)) {
    const searchValues = {
      issueStatus: this.issueStatus,
      projectNo: this.projectId,
    };
    this.issueService.searchIssues(searchValues);
    // } else {
    //   this.alertify.error("Wrong Project No Format");
    // }
  }
  applyChange(issue: any, subProject: any, status: any) {
    // console.log(status);
    const subProjectStatus = issue.subProjectStatuses.find(
      (x: any) => x.subProjectId == subProject.subProjectId
    );
    subProjectStatus.status = status;
    this.issueService.updateSubProjectStatus(subProjectStatus);
  }
  updateSubProjectStatus(sub: any, status: any) {
    sub.status = status;
    this.projectService.updateSubProjectStatus(sub);
  }
  findStatus(issue: any, subProject: any) {
    return issue.subProjectStatuses.find(
      (x: any) => x.subProjectId == subProject.subProjectId
    ).status;
  }
  getIssueInfo(issue: any) {
    console.log(issue);
    let matStatus = "missing";
    let matNotes = "";
    issue.issueActions.forEach((e) => {
      if (e.responsible !== null) {
        if (e.responsible.groupId === "MAT") {
          matStatus = e.actionStatus;
          matNotes = e.actionNotes;
        }
      }
    });
    return (
      issue.issueNotes + "\nMAT Action Status:" + matStatus + "\n" + matNotes
    );
  }
}
