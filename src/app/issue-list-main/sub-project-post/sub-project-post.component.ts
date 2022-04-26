import { Component, Input, OnInit,ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { AlertifyService } from "src/app/_services/alertify.service";
import { AuthService } from "src/app/_services/auth.service";
import { IssueActionService } from "src/app/_services/issue-action.service";
import { IssueService } from 'src/app/_services/issue.service';
import { ActionTemplateComponent } from "./../action-template/action-template.component";
@Component({
  selector: "app-sub-project-post",
  templateUrl: "./sub-project-post.component.html",
  styleUrls: ["./sub-project-post.component.css"],
})
export class SubProjectPostComponent implements OnInit {
  @Input() subProjectStatus: any;
  @Input() issue: any;
  @Input() userId: any;
  displayActions = false;
  statusForm: FormGroup;
  user: any;
  @ViewChild('actionTemplate') actionTemplate: ActionTemplateComponent;

  constructor(
    private fb: FormBuilder,
    private actionService: IssueActionService,
    private issueService:IssueService,
    private authService:AuthService,
    private alertify: AlertifyService
  ) {
    this.authService.currentUserAccount.subscribe((x) => (this.user = x));
  }

  ngOnInit() {
    this.initFormGroup();
  }
  initFormGroup() {
    this.statusForm = this.fb.group({
      status: [this.subProjectStatus.status],
    });
  }
  hasActions(){
    return this.issue.issueActions.some(x=> x.subProjectId == this.subProjectStatus.subProjectId);
  }
  updateSubProjectStatus(){
    this.subProjectStatus.status = this.statusForm.get('status').value;
    this.issueService.updateSubProjectStatus(this.subProjectStatus);
  }
  addAction() {
    // const action = {
    //   createdById: this.userId,
    //   issueId: this.issue.id,
    //   actionStatus: "draft",
    //   subProjectId: this.subProjectStatus.subProjectId,
    // };
    // this.actionService.addAction(action, 1);
    this.actionTemplate.open(this.user,this.subProjectStatus.subProjectId).then((resolve)=>{}).catch((err)=>{});
  }
  toggleDisplayActions(){
    this.displayActions = !this.displayActions;
  }

  test() {
    console.log(this.subProjectStatus.subProjectId);
    console.log(this.issue);
  }
  deleteSubProject(){
    this.alertify.confirm(`Are you sure you want to delete subproject ${ this.subProjectStatus.subProjectId}`,  () => {
      this.issueService.deleteSubProject({issueId: this.subProjectStatus.issueId, projectNo: this.subProjectStatus.subProjectId })
    }, ()=>{
      this.alertify.warning('Delete cancelled!')
    })
  }
}
