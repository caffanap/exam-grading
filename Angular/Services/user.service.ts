import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseUrl } from '../static/base_url';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private storage: StorageService) { }
  

  headerOptions(){
    let token = this.storage.getToken()
    return {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token })
    }
  }

  nilaitryout(formdata: FormData){
    return this.http.post<any>(BaseUrl.url+BaseUrl.nilaitryoutassign, formdata, this.headerOptions())
  }

  getNilaiTryout(formdata: FormData){
    return this.http.post<any>(BaseUrl.url+BaseUrl.nilaitryoutshowuser, formdata, this.headerOptions())
  }

}
