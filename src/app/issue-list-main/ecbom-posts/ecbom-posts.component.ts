import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ecbom-posts',
  templateUrl: './ecbom-posts.component.html',
  styleUrls: ['./ecbom-posts.component.css']
})
export class EcbomPostsComponent implements OnInit {
  @Input() ecParts: any;
  constructor() { }

  ngOnInit() {
  }

}
