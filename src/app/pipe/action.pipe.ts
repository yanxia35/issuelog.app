import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'action',
  pure:false
})
export class ActionPipe implements PipeTransform {

  transform(actionList: any, isSubProject: boolean, subProjectId?:any): any {
    return isSubProject ? actionList.filter((x) => x.subProjectId === subProjectId): actionList.filter((x) => x.subProjectId === null);

  }
}
