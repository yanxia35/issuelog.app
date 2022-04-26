import { Component, OnInit, Injectable, Input,TemplateRef,ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NgbModal, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { IssueActionService } from "../../_services/issue-action.service";
import { AlertifyService } from './../../_services/alertify.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-action-template',
  templateUrl: './action-template.component.html',
  styleUrls: ['./action-template.component.css']
})

@Injectable()
export class ActionTemplateComponent implements OnInit{
  @Input() public issue : any;
  @ViewChild('modal') private modalContent: TemplateRef<ActionTemplateComponent>;
  public currentStep : number; 
  public selectedTemplate : string;
  public action : any;
  public actionOwnerResult : any;
  public actionTemplateResult : any;
  public user: any;
  public subID: any;
  private modalRef: NgbModalRef;
  private modalOptions : NgbModalOptions = 
  {
    size: 'lg',
    centered: true,
    backdrop : 'static',
    scrollable: false
  }
  
  constructor(
    private modalService: NgbModal,
    private actionService: IssueActionService,
    private alertify: AlertifyService,
    private http: HttpClient,
    ){}

  ngOnInit(): void {
    this.actionService.actionOwner.subscribe((res) => {
      if(res != undefined && res != null)
      {
        this.actionOwnerResult = res.actionOwner;
        this.actionTemplateResult = res.actionTemplate;
      }
      else{
        this.actionOwnerResult = undefined;
        this.actionTemplateResult = undefined;
      }
    });
  }

  open(user,subID): Promise<boolean>{
    //console.log(this.issue); // use for debugging
    this.user = user;
    this.subID = subID;
    this.currentStep = 1;
    this.action = {};
    this.selectedTemplate = "";

    return new Promise<boolean>((resolve,reject) =>{
      this.modalRef = this.modalService.open(this.modalContent,this.modalOptions);
      this.modalRef.result.then((settled)=>{
        resolve(true);
      }).catch((canceled)=>{
        reject(false);
      });
    })
  }

  dismiss() {
    this.reset();
    this.modalRef.dismiss()
  }

  close(){
    this.reset();
    this.modalRef.close()
  }

  showStep(step:number){
    return step == this.currentStep;
  }

  stepBack(){
    this.currentStep -= 1;
    if(this.currentStep ==1){
      this.reset();
    }
  }

  stepBackToMain(){
    this.currentStep = 1;
    this.reset();
  }

  buildBlankAction(){
    {
      this.action.createdById = this.user.id;
      this.action.issueId = this.issue.id;
      this.action.actionStatus = "draft";
      if(this.subID != undefined && this.subID != null){
        this.action.subProjectId = this.subID;
      }
    }
    this.currentStep = 3;
  }

  /**
   * 
   * @param template: The template being selected in the pop up window
   * 
   * The function call the getActionOwner function with a seraching condition which constains the 
   * selected tempalte and the issue which the action belongs to
   */
  select(template : string){
    this.selectedTemplate = template;

    var condition = {
      template : this.selectedTemplate,
      issue : Object.assign({},this.issue)
    }
    if(this.subID != null && this.subID != undefined){
      condition.issue.project = this.subID;
    }

    this.actionService.getActionOwner(condition);
    this.currentStep += 1;
  }

  addAction(){
    if(Object.keys(this.action).length ===0){     //checking if the action is empty
      this.alertify.error("Action is empty and NOT added");
    }else{
      this.actionService.addAction(this.action, 1);
    }
    this.modalRef.close();
  }
  reset(){
    this.action = {};
    this.selectedTemplate = "";
    this.actionTemplateResult = undefined;
  }

  convertToDate(date: any) {
    if (date !== '') {
      const dateReturn: Date = new Date(date.year, date.month - 1, date.day);
      return dateReturn;
    } else {
      return null;
    }
  }

  drawingSelect(template:string){
    var condition = {
      template : template,
      issue : Object.assign({},this.issue)
    }

    if(this.subID != null && this.subID != undefined){
      condition.issue.project = this.subID;
    }
    
    this.http.post(environment.apiUrl + 'action/' + 'getecdrawingowner', condition).subscribe(
      res => {
        if (res !== []) {
          //console.log(res); // used for debugging
          this.addEcDrawingAction(res);
        }
      },
      error => {
        this.alertify.error(JSON.stringify(error.error));
      }
    );
  }

  addEcDrawingAction(res:any){
    if(res.message == "success"){
      this.buildEcDrawingAction(res);
      this.actionService.addAction(this.action, 1);
      this.modalRef.close();
    }else if(res.message == "success_completion"){
      this.buildEcDrawingActionCompletion(res);
      this.actionService.addAction(this.action, 1);
      this.modalRef.close();
    }else{
      this.alertify.warning(res.message + "\n This function is not available for this Issue");
    }
  }

  buildEcDrawingAction(res:any){
    this.action.createdById = this.user.id;
    this.action.issueId = this.issue.id;
    this.action.actionNotes = res.actionTemplate;
    if(res.actionOwner != null){
      this.action.responsibleId = res.actionOwner[0].id;
    }
    this.action.actionStatus = "active";
    if(this.subID != undefined && this.subID != null){
      this.action.subProjectId = this.subID;
    }
  }

  buildEcDrawingActionCompletion(res:any){
    this.action.createdById = this.user.id;
    this.action.issueId = this.issue.id;
    this.action.actionNotes = res.actionTemplate;
    if(res.actionOwner != null){
      this.action.responsibleId = res.actionOwner[0].id;
    }
    this.action.actionStatus = "closed";
    if(this.subID != undefined && this.subID != null){
      this.action.subProjectId = this.subID;
    }
  }
}