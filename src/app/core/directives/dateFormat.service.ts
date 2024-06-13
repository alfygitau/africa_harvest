import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn:'root'
})


export class DateFormatService {
    constructor() {

    }

    
  dateFormat(date:any){
    return date.year.toString() +'-'+ date.month.toString().padStart(2, '0')+'-'+date.day.toString().padStart(2, '0')
  } 
}