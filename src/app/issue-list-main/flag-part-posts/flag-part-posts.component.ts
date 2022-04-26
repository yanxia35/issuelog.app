import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-flag-part-posts',
  templateUrl: './flag-part-posts.component.html',
  styleUrls: ['./flag-part-posts.component.css']
})
export class FlagPartPostsComponent implements OnInit {
  @Input() flagPartList: any;
  constructor() { }

  ngOnInit() {
  }

}
