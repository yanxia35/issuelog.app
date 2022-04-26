import { Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import{FormBuilder,FormGroup, Validators} from "@angular/forms";
import { IssueActionService } from "../../../_services/issue-action.service";
import * as dateFormat from 'dateformat';

@Component({
  selector: 'app-sit-template',
  templateUrl: './sit-template.component.html',
  styleUrls: ['./sit-template.component.css']
})
export class SitTemplateComponent implements OnInit, OnChanges{
  @Input() actionOwners : any;
  @Input() user : any;
  @Input() issue : any;
  @Input() subID : any;
  @Output() closemodal: EventEmitter<any> = new EventEmitter();
  @Output() goback : EventEmitter<any> = new EventEmitter();
  public sitForm : FormGroup;
  private action : any;
  public ownerFound :boolean;

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
      this.sitForm.controls['responsibleId'].setValue(this.actionOwners[0].id);
      this.ownerFound = true;
    }else{
      this.ownerFound = false;
    }
  }

  creatForm(){
    this.sitForm = this.fb.group({
      responsibleId: ['', Validators.required],
      actionNotes: ['', Validators.required],
      specialInstructions: ['']
    });
  }

  cleanForm(){
    this.sitForm.get('responsibleId').setValue('');
    this.sitForm.get('actionNotes').setValue('');
    this.sitForm.get('specialInstructions').setValue('');
  }

  back()
  { 
    this.action = {};
    this.cleanForm();
    this.goback.emit();
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
    //alert(this.sitForm.get('responsibleId').value + this.ownerFound);
  }
  
  

  buildAction(){
    this.action.createdById = this.user.id;
    this.action.issueId = this.issue.id;

    if (this.sitForm.get('actionNotes').value !== '' && typeof this.sitForm.get('actionNotes').value !== 'undefined')
    {
      this.action.actionNotes =
        this.user.username +
        ' ' +
        dateFormat(Date(), 'yyyy-mm-dd,h:MM TT') +
        '\n' +
        'Action Note:\n' + this.sitForm.get('actionNotes').value;

        if(this.sitForm.get('specialInstructions').value !== '' && typeof this.sitForm.get('specialInstructions').value !== 'undefined')
        {
          this.action.actionNotes = this.action.actionNotes +
          '\n' + 'Special Instruction:\n' + this.sitForm.get('specialInstructions').value;
        }
        
        this.action.actionNotes = this.action.actionNotes + '\n-------------------\n';
    }

    if(this.subID != null && this.subID != undefined){
      this.action.subProjectId = this.subID;
    }

    this.action.responsibleId = this.sitForm.get('responsibleId').value;
    this.action.actionStatus = "active";
  }

  formHasErr()
  {
    return this.sitForm.get('responsibleId').invalid || this.sitForm.get('actionNotes').invalid
  }
}
