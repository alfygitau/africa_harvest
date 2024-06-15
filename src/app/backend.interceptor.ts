import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class BackendInterceptor implements HttpInterceptor {
  constructor(public router:Router) {}
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token: string = sessionStorage.getItem('token') || ''

    if (token) {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': `Bearer ${token}`,
        }
      });
    }
    request = request.clone({
      setHeaders: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    });
    // return next.handle(request);
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
          }
          return event;
      }),
      catchError((error) => {
      if(error.status==401){
        this.router.navigateByUrl('/account/login')
      }
       return throwError(error);
      }));
  }
}
