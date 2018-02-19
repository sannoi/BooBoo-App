import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortDescBy',
  pure: false
})
export class SortDescByPipe implements PipeTransform {
  transform(array: Array<Object>, args: string): Array<Object> {

    if (array == null) {
      return null;
    }

    array.sort((a: any, b: any) => {
      let aDeep = goDeep(a, args).toLowerCase();
      let bDeep = goDeep(b, args).toLowerCase();
      if (aDeep > bDeep) {
        //a is the Object and args is the orderBy condition (data.likes.count in this case)
        return -1;
      } else if (aDeep < bDeep) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}

function goDeep(obj, desc) {
  var arr = desc.split(".");
  while (arr.length && (obj = obj[arr.shift()]));
  return obj;
}
