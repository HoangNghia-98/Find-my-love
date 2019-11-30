import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'calYear'})
export class CalYearPipe implements PipeTransform {
  transform(date: string): number {
    let number = ""
    if(date){
        for(let i = date.length-1; i>=0;i--){
            if (date[i]!=="/"&&date[i]!=="-"){
                number+=date[i]
            }else{
                break;
            }
        }
        number = number.split("").reverse().join(""); 
        return new Date().getFullYear() - parseInt(number)
    }
    return null
  }
}