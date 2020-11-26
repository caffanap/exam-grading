import { Injectable } from '@angular/core';
import { Store } from '../static/store';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  getToken(){
    return localStorage.getItem(Store.token)
  }

  getBio(){
    return localStorage.getItem(Store.bioAccount)
  }

  getEmail(){
    return localStorage.getItem(Store.email)
  }

  getHakAkses(){
    return localStorage.getItem(Store.hakAkses)
  }

  refreshToken(token){
    localStorage.setItem(Store.token, token)
  }

  deleteItem(key){
    localStorage.removeItem(key)
  }

  deleteStorage(){
    localStorage.clear()
  }

}
