import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-sub-project-actions",
  templateUrl: "./sub-project-actions.component.html",
  styleUrls: ["./sub-project-actions.component.css"],
})
export class SubProjectActionsComponent implements OnInit {
  @Input() issue: any;
  @Input() subProjectId:any;
  constructor() {}

  ngOnInit() {}
}
