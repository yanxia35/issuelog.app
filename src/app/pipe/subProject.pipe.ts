import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'subProject'
})
export class SubProjectPipe implements PipeTransform {

  transform(subProjectLIst: any[], mainProjectNo: any): any {
    if(mainProjectNo === null || mainProjectNo === undefined){
      return null;
    }
    // console.log(subProjectLIst);
    return subProjectLIst.filter(x => x.mainProjectId === mainProjectNo);
  }

}
