import { IssueEditorComponent } from "./../../editor/issue-editor/issue-editor.component";
import { AlertifyService } from "./../../_services/alertify.service";
import { SubscribeService } from "./../../_services/subscribe.service";
import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { IssueService } from "../../_services/issue.service";
import { IssueActionService } from "../../_services/issue-action.service";
import { AuthService } from "../../_services/auth.service";
import { ProjectService } from "src/app/_services/project.service";
import { ActionTemplateComponent } from "./../action-template/action-template.component";

@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.scss"],
})
export class PostComponent implements OnInit {
  @Input() issue: any;
  subProjects: any;
  currentEditor;
  displayAction = false;
  displayFlag = false;
  displayEcBom = false;
  displayProjectMatrix = false;
  edittingIssue: any;
  edittingAction: any;
  customMatrix: any;
  user: any;
  @ViewChild(IssueEditorComponent) issueEditor: IssueEditorComponent;
  @ViewChild('actionTemplate') actionTemplate: ActionTemplateComponent;
  constructor(
    private issueService: IssueService,
    private authService: AuthService,
    private actionService: IssueActionService,
    private subscribeService: SubscribeService,
    private projectService: ProjectService,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    this.authService.currentUserAccount.subscribe((x) => (this.user = x));
    this.issueService.issue.subscribe((res) => {
      this.edittingIssue = res;
    });
    this.issueService.editorSelector.subscribe((res) => {
      this.currentEditor = res;
    });
    this.projectService.subProjects.subscribe((res) => {
      this.subProjects = res;
    });
    console.debug(this.issue);
  }
  hasDefaultSubProject() {
    return this.subProjects.some((x) => x.mainProjectId == this.issue.project);
  }

  hasSubProject(){
    return this.issue.subProjectStatuses ? this.issue.subProjectStatuses.length> 0 : false
  }
  /**
   * Determines whether linked to sub projects is
   */
  isLinkedToSubProjects(){
    console.debug(this.issue);
    if(this.issue.hasOwnProperty('subProjectStatuses')){
      if(this.issue.subProjectStatuses.length !== 0){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }
  linkSubProjects(){
    this.alertify.confirm('Do you want to establish the issue matrix for duplicated stations of ' + this.issue.project +'?',()=>{
      this.issueService.linkSubProjects(this.issue.id);
    },()=>{
      this.alertify.warning('Canceled');
    }
    )
  }
  test(){
    console.log(this.issue);
  }
  toggleActionList() {
    this.displayAction = !this.displayAction;
    this.displayFlag = false;
    this.displayEcBom = false;
  }
  toggleFlagList() {
    this.displayAction = false;
    this.displayFlag = !this.displayFlag;
    this.displayEcBom = false;
  }
  toggleEcbomList() {
    this.displayAction = false;
    this.displayFlag = false;
    this.displayEcBom = !this.displayEcBom;
  }
  editIssue() {
    this.issueService.toggleEditor("issue");
    this.issueService.selectIssue(this.issue.id);
  }
  addAction() {
    // const action = {
    //   createdById: this.user.id,
    //   issueId: this.issue.id,
    //   actionStatus: "draft",
    // };
    // this.actionService.addAction(action, 1);
    this.actionTemplate.open(this.user,null).then((resolve)=>{
      this.displayAction = true;
    }).catch((err)=>{
    });
  }
  isSubscriber() {
    if (this.issue.subscribers) {
      const index = this.issue.subscribers.findIndex(
        (x) => x.employeeId === this.user.id
      );
      if (index > -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  addSubscriber() {
    const subscriber = {
      id: 0,
      employeeId: this.user.id,
      issueId: this.issue.id,
    };
    this.subscribeService.addSubscriber(subscriber);
  }
  deleteSubscriber() {
    const subscriber = {
      id: 0,
      employeeId: this.user.id,
      issueId: this.issue.id,
    };
    this.subscribeService.deleteSubscriber(subscriber);
  }

  /**
   * Toggles project matrix display
   */
  toggleProjectMatrix(){
    this.displayProjectMatrix = !this.displayProjectMatrix
  }

  getIssueTooltipInfo(){
      return 'Issue Originator:'+this.issue.originator.firstName + ' ' +
      this.issue.originator.lastName + ', Department: ' + this.issue.originator.groupId;

  }
  createCustomMatrix(){
    const prjRegex = new RegExp(/[a-zA-Z]{1}[0-9]{2}[-]{1}[0-9]{3,4}/g);
    this.customMatrix = this.customMatrix.replace(/ /g, '');
    if (prjRegex.test(this.customMatrix)){
      this.issueService.linkCustomProject({issueId:this.issue.id,projectNo:this.customMatrix})
    } else {
      this.alertify.warning('Incorrect Project Number')
    }
  }
}
