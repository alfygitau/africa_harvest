import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { NgxSpinnerService } from "ngx-spinner";

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
    constructor(private spinner: NgxSpinnerService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.spinner.show();
        return next.handle(req).pipe(
            catchError((err) => {
                return throwError(err);
            }),
            finalize(() => {
                this.spinner.hide();
            })
        );
    }
}