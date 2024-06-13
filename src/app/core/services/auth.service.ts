import { Injectable } from '@angular/core';
import { getFirebaseBackend } from '../../authUtils';
import { User } from '../models/auth.models';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { end } from '@popperjs/core';
import { Router } from '@angular/router';
export const endpoint = 'https://ah.egroup.co.ke/api/';


@Injectable({ providedIn: 'root' })

/**
 * Auth-service Component
 */
export class AuthenticationService {

    user!: User;
    currentUserValue: any;

    constructor(private http:HttpClient,private router:Router) { }

    /**
     * Performs the register
     * @param email email
     * @param password password
     */

    private extractData(res: any) {
        const body = res 
        return body || {}
    }
    register(email: string, password: string) {
        return getFirebaseBackend()!.registerUser(email, password).then((response: any) => {
            const user = response;
            return user;
        });
    }

    /**
     * Performs the auth
     * @param email email of user
     * @param password password of user
     */
    login(data: any): Observable<any> {
        // return getFirebaseBackend()!.loginUser(email, password).then((response: any) => {
        //     const user = response;
        //     return user;
        // });

        console.log('in')

        return this.http.post(endpoint+'auth/request', data).pipe(
            map((this.extractData))
        )
    }

    /**
     * Returns the current user
     */
    public currentUser(): any {
        return getFirebaseBackend()!.getAuthenticatedUser();
    }

    /**
     * Logout the user
     */
   
    logout() {
        sessionStorage.removeItem('token');
         sessionStorage.removeItem('username');
         sessionStorage.removeItem('id');
         this.router.navigate(['/account/login']);
     }

    /**
     * Reset password
     * @param email email
     */
    resetPassword(email: string) {
        return getFirebaseBackend()!.forgetPassword(email).then((response: any) => {
            const message = response.data;
            return message;
        });
    }

    isAuthenticated() {
        return true
    }

}

