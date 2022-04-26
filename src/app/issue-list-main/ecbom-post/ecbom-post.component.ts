import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ecbom-post',
  templateUrl: './ecbom-post.component.html',
  styleUrls: ['./ecbom-post.component.css']
})
export class EcbomPostComponent implements OnInit {
  @Input() ecPart: any;
  constructor() { }

  ngOnInit() {
  }

}
