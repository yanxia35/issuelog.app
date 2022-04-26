import { Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import{FormBuilder,FormGroup, Validators} from "@angular/forms";
import { IssueActionService } from "../../../_services/issue-action.service";
import * as dateFormat from 'dateformat';

@Component({
  selector: 'app-elec-template',
  templateUrl: './elec-template.component.html',
  styleUrls: ['./elec-template.component.css']
})
export class ElecTemplateComponent implements OnInit {
  @Input() actionOwners : any;
  @Input() user : any;
  @Input() issue : any;
  @Input() subID : any;
  @Output() closemodal: EventEmitter<any> = new EventEmitter();
  @Output() goback : EventEmitter<any> = new EventEmitter();
  public elecForm : FormGroup;
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
      this.elecForm.controls['responsibleId'].setValue(this.actionOwners[0].id);
      this.ownerFound = true;
    }else{
      this.ownerFound = false;
    }
  }

  creatForm(){
    this.elecForm = this.fb.group({
      responsibleId: ['', Validators.required],
      actionNotes: ['', Validators.required],
      elecDrawingNumber: [''],
      partsAdded: [''],
      partsRemoved: [''],
      specialInstructions: ['']
    });
  }

  cleanForm(){
    this.elecForm.get('responsibleId').setValue('');
    this.elecForm.get('actionNotes').setValue('');
    this.elecForm.get('elecDrawingNumber').setValue('');
    this.elecForm.get('partsAdded').setValue('');
    this.elecForm.get('partsRemoved').setValue('');
    this.elecForm.get('specialInstructions').setValue('');
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
    //alert(this.elecForm.get('responsibleId').value + this.ownerFound);  // Use for debugging 
  }

  buildAction(){
    this.action.createdById = this.user.id;
    this.action.issueId = this.issue.id;

    if (this.elecForm.get('actionNotes').value !== '' && typeof this.elecForm.get('actionNotes').value !== 'undefined')
    {
      this.action.actionNotes =
        this.user.username +
        ' ' +
        dateFormat(Date(), 'yyyy-mm-dd,h:MM TT') +
        '\n' +
        'Action Note: \n' + this.elecForm.get('actionNotes').value;

        if(this.elecForm.get('elecDrawingNumber').value !== '' && typeof this.elecForm.get('elecDrawingNumber').value !== 'undefined')
        {
          this.action.actionNotes = this.action.actionNotes +
          '\n' + 'Assembly Number: \n' + this.elecForm.get('elecDrawingNumber').value;
        }

        if(this.elecForm.get('partsAdded').value !== '' && typeof this.elecForm.get('partsAdded').value !== 'undefined')
        {
          this.action.actionNotes = this.action.actionNotes +
          '\n' + 'Part(s) Added: \n' + this.elecForm.get('partsAdded').value;
        }

        if(this.elecForm.get('partsRemoved').value !== '' && typeof this.elecForm.get('partsRemoved').value !== 'undefined')
        {
          this.action.actionNotes = this.action.actionNotes +
          '\n' + 'Part(s) Removed: \n' + this.elecForm.get('partsRemoved').value;
        }

        if(this.elecForm.get('specialInstructions').value !== '' && typeof this.elecForm.get('specialInstructions').value !== 'undefined')
        {
          this.action.actionNotes = this.action.actionNotes +
          '\n' + 'Special Instruction: \n' + this.elecForm.get('specialInstructions').value;
        }
        
        this.action.actionNotes = this.action.actionNotes + '\n--------------------------\n';
    }

    if(this.subID != null && this.subID != undefined){
      this.action.subProjectId = this.subID;
    }

    this.action.responsibleId = this.elecForm.get('responsibleId').value;
    this.action.actionStatus = "active";
  }

  formHasErr()
  {
    return this.elecForm.get('responsibleId').invalid || this.elecForm.get('actionNotes').invalid
  }

}
