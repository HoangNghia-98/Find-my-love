import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({name: 'calTimeOnline'})
export class CalTimeOnlinePipe implements PipeTransform {
  transform(lastOnline: Date): string {
    let end = lastOnline
    let cur = moment(new Date())
    let time = moment.duration(cur.diff(end))
    if (time.asSeconds() <= 60) {
        return Math.floor(time.asSeconds()) + " giây"
    } else if (time.asMinutes() <= 60) {
       return Math.floor(time.asMinutes()) + " phút"
    } else if (time.asHours() <= 60) {
       return  Math.floor(time.asHours()) + " giờ"
    } else if (time.asDays() < 31) {
       return  Math.floor(time.asDays()) + " ngày"
    } else if (time.asMonths() < 13) {
       return  Math.floor(time.asMonths()) + " tháng"
    }else{
        return ""
    }
  }
}