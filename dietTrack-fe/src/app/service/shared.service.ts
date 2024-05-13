import { Injectable } from '@angular/core';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  message: any = {};

  constructor() { }
  setMessage(data: any){
    this.message = data;
  }
  getMessage(){
    return this.message;
  }
}
