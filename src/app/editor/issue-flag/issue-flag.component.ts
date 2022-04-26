import { IssueService } from '../../_services/issue.service';
import { AlertifyService } from '../../_services/alertify.service';
import { PartIssueService } from '../../_services/part-issue.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-issue-flag',
  templateUrl: './issue-flag.component.html',
  styleUrls: ['./issue-flag.component.css']
})
export class IssueFlagComponent implements OnInit {
  flagForm: FormGroup;
  @Input() issue: any;
  constructor(
    private fb: FormBuilder,
    private partIssueService: PartIssueService,
    private alertify: AlertifyService,
    private issueService: IssueService
  ) { }

  ngOnInit() {
    this.createForm();
  }
  createForm() {
    this.flagForm = this.fb.group({
      partNo: [
        '',
        [
          Validators.required,
          Validators.pattern('(([1237]{1}[0-9]{6})+[,]*[ ]*)+')
        ]
      ]
    });
  }

  getPartNoList() {
    const regex = /([1237]{1}[0-9]{6})/g;
    const partNoList = this.flagForm.get('partNo').value.match(regex);
    console.log(partNoList);
    return partNoList;
  }
  flag(input: boolean) {
    const partNoList = this.getPartNoList();
    partNoList.forEach(e => {
      const partToFlag = {
        partNo: e,
        issueNo: this.issue.issueNo,
        issueId: this.issue.id,
        isHardFlag: input
      };
      this.partIssueService.flag(partToFlag).subscribe(res => {
        this.issueService.addFlagPartToIssue(res);
        this.alertify.success(partToFlag.partNo + ' is flagged!');
        this.flagForm.get('partNo').setValue('');
      }, error => {
        this.alertify.error(error.error);
      });
    });
  }
}
