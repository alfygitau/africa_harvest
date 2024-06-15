import { Directive } from '@angular/core';

@Directive({
  selector: '[appDateFormat]',
  standalone: true
})
export class DateFormatDirective {

  constructor() { }

  dateFormat(date:any){
    return date.year.toString() +'-'+ date.month.toString().padStart(2, '0')+'-'+date.day.toString().padStart(2, '0')
  }

}
