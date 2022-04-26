import { Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import{FormBuilder,FormGroup, Validators} from "@angular/forms";
import { IssueActionService } from "../../../_services/issue-action.service";
import * as dateFormat from 'dateformat';

@Component({
  selector: 'app-material-template',
  templateUrl: './material-template.component.html',
  styleUrls: ['./material-template.component.css']
})
export class MaterialTemplateComponent implements OnInit, OnChanges {
  @Input() actionOwners : any;
  @Input() user : any;
  @Input() issue : any;
  @Input() subID : any;
  @Output() closemodal: EventEmitter<any> = new EventEmitter();
  @Output() goback : EventEmitter<any> = new EventEmitter();
  public materialForm : FormGroup;
  public ownerFound :boolean;
  private action : any;

  constructor(
    private actionService: IssueActionService,
    private fb : FormBuilder,
  ) { }

  ngOnInit(): void {
    this.action = {};
    this.creatForm();
  }

  ngOnChanges (changes): void{
    if(changes.actionOwners.currentValue != undefined &&changes.actionOwners.currentValue!= null && changes.issue == undefined){
      this.creatForm();
      this.materialForm.controls['responsibleId'].setValue(this.actionOwners[0].id);
      this.ownerFound = true;
    }else{
      this.ownerFound = false;
    }
  }

  creatForm(){
    this.materialForm = this.fb.group({
      responsibleId: ['', Validators.required],
      actionNotes: ['Prepare the red bin and deliver the parts to the station.', Validators.required]
    });
  }

  cleanForm(){
    this.materialForm.controls['responsibleId'].setValue('');
    this.materialForm.controls['actionNotes'].setValue('');
  }


  addAction()
  {
    if(this.formHasErr())
    {
      alert("Please fill all the Required section");
    }else
    {
      this.buildAction();
      this.actionService.addAction(this.action, 1);
      this.cleanForm();
      this.closemodal.emit();
      this.action = {};
    } 
    
  }
  
  back()
  { 
    this.action = {};
    this.cleanForm();
    this.goback.emit();
  }

  buildAction(){
    let errmsg = "";
    this.action.createdById = this.user.id;
    this.action.issueId = this.issue.id;

    if (this.materialForm.get('actionNotes').value !== '' && typeof this.materialForm.get('actionNotes').value !== 'undefined')
    {
      this.action.actionNotes =
        this.user.username +
        ' ' +
        dateFormat(Date(), 'yyyy-mm-dd,h:MM TT') +
        '\n' +
        'Action Note:\n' + this.materialForm.get('actionNotes').value;
        
        this.action.actionNotes = this.action.actionNotes + '\n-------------------\n';
    }else
    {
      errmsg = "The Action Notes can not be empty"
    }

    this.action.responsibleId = this.materialForm.get('responsibleId').value;
    if(this.action.responsibleId == undefined || this.action.responsibleId == "" || this.action.responsibleId == null){
      errmsg = "The Responsible ID can not be empty"
    }

    if(this.subID != null && this.subID != undefined){
      this.action.subProjectId = this.subID;
    }
  
    this.action.actionStatus = "active";

    return errmsg;
  }

  formHasErr()
  {
    return this.materialForm.get('responsibleId').invalid || this.materialForm.get('actionNotes').invalid
  }
}
