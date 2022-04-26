import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-issue-matrix",
  templateUrl: "./issue-matrix.component.html",
  styleUrls: ["./issue-matrix.component.css"],
})
export class IssueMatrixComponent implements OnInit {
  @Input() subProjectStatuses: any;
  @Input() issue: any;
  @Input() userId: any;
  constructor() {}

  ngOnInit() {}
}
