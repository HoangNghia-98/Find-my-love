import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'address'})
export class AddressPipe implements PipeTransform {
  transform(address: string): string {
    let city = ""
    if (address){
        for(let i = address.length-1; i>=0;i--){
            if (address[i]!==","){
                city+=address[i]
            }else{
                break;
            }
        }
         
        return city.split("").reverse().join(""); 
    }
    return city
  }
}