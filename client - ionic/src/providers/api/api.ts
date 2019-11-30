import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InfoProvider } from '../info/info';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {
  mode:String = "prod"
  link:String = "http://localhost:3030"
  constructor(
      public http: HttpClient,
      public info:InfoProvider
    ) {
    console.log('Hello ApiProvider Provider');
    if(this.mode ==="prod"){
        this.link = "https://auth-find-my-love.herokuapp.com"
    }
  }

  getHeader() {
    const token = this.info.token;
    return token ? new HttpHeaders().set("Authorization", token) : null;
  }

  get(link: string) {
    return this.http.get(link, { headers: this.getHeader() }).toPromise();
  }

  post(link: string, body: any) {
    return this.http
      .post(link, body, { headers: this.getHeader() })
      .toPromise();
  }
  delete(link: string, _id: any) {
    let headers = new HttpHeaders()
                    .set("Authorization",this.info.token)
                    .set("_id",_id)
    console.log("header",headers)
    return this.http
      .delete(link,  { headers })
      .toPromise();
  }
}
