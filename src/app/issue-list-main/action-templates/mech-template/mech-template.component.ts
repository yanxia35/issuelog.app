import { Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import{FormBuilder,FormGroup, Validators} from "@angular/forms";
import { IssueActionService } from "../../../_services/issue-action.service";
import * as dateFormat from 'dateformat';

@Component({
  selector: 'app-mech-template',
  templateUrl: './mech-template.component.html',
  styleUrls: ['./mech-template.component.css']
})
export class MechTemplateComponent implements OnInit, OnChanges {
  @Input() actionOwners : any;
  @Input() user : any;
  @Input() issue : any;
  @Input() subID : any;
  @Output() closemodal: EventEmitter<any> = new EventEmitter();
  @Output() goback : EventEmitter<any> = new EventEmitter();
  public mechForm : FormGroup;
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
      this.mechForm.controls['responsibleId'].setValue(this.actionOwners[0].id);
      this.ownerFound = true;
    }else{
      this.ownerFound = false;
    }
  }

  creatForm(){
    this.mechForm = this.fb.group({
      responsibleId: ['', Validators.required],
      actionNotes: ['', Validators.required],
      assemblyNumber: [''],
      partsAdded: [''],
      partsRemoved: [''],
      specialInstructions: ['']
    });
  }

  cleanForm(){
    this.mechForm.get('responsibleId').setValue('');
    this.mechForm.get('actionNotes').setValue('');
    this.mechForm.get('assemblyNumber').setValue('');
    this.mechForm.get('partsAdded').setValue('');
    this.mechForm.get('partsRemoved').setValue('');
    this.mechForm.get('specialInstructions').setValue('');
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
    //alert(this.mechForm.get('responsibleId').value + this.ownerFound);  // Use for debugging 
  }

  buildAction(){
    this.action.createdById = this.user.id;
    this.action.issueId = this.issue.id;

    if (this.mechForm.get('actionNotes').value !== '' && typeof this.mechForm.get('actionNotes').value !== 'undefined')
    {
      this.action.actionNotes =
        this.user.username +
        ' ' +
        dateFormat(Date(), 'yyyy-mm-dd,h:MM TT') +
        '\n' +
        'Action Note: \n' + this.mechForm.get('actionNotes').value;

        if(this.mechForm.get('assemblyNumber').value !== '' && typeof this.mechForm.get('assemblyNumber').value !== 'undefined')
        {
          this.action.actionNotes = this.action.actionNotes +
          '\n' + 'Assembly Number: \n' + this.mechForm.get('assemblyNumber').value;
        }

        if(this.mechForm.get('partsAdded').value !== '' && typeof this.mechForm.get('partsAdded').value !== 'undefined')
        {
          this.action.actionNotes = this.action.actionNotes +
          '\n' + 'Part(s) Added: \n' + this.mechForm.get('partsAdded').value;
        }

        if(this.mechForm.get('partsRemoved').value !== '' && typeof this.mechForm.get('partsRemoved').value !== 'undefined')
        {
          this.action.actionNotes = this.action.actionNotes +
          '\n' + 'Part(s) Removed: \n' + this.mechForm.get('partsRemoved').value;
        }

        if(this.mechForm.get('specialInstructions').value !== '' && typeof this.mechForm.get('specialInstructions').value !== 'undefined')
        {
          this.action.actionNotes = this.action.actionNotes +
          '\n' + 'Special Instruction: \n' + this.mechForm.get('specialInstructions').value;
        }
        
        this.action.actionNotes = this.action.actionNotes + '\n--------------------------\n';
    }

    if(this.subID != null && this.subID != undefined){
      this.action.subProjectId = this.subID;
    }

    this.action.responsibleId = this.mechForm.get('responsibleId').value;
    this.action.actionStatus = "active";
  }

  formHasErr()
  {
    return this.mechForm.get('responsibleId').invalid || this.mechForm.get('actionNotes').invalid
  }

}
