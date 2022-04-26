import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../_services/project.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  projects: any;

  constructor(
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.projectService.getProjects();
    this.projectService.projects.subscribe(res => {
      this.projects = res;
    });
  }

}
