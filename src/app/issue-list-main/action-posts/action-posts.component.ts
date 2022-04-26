import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-action-posts',
  templateUrl: './action-posts.component.html',
  styleUrls: ['./action-posts.component.css']
})
export class ActionPostsComponent implements OnInit {
  @Input() issueActions: any[];
  constructor() { }

  ngOnInit() {
  }

}
