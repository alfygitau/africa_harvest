import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../core/services/authfake.service';
import { environment } from '../../../environments/environment';
import { LAYOUT_MODE } from '../../layouts/layouts.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

/**
 * Login Component
 */
export class LoginComponent implements OnInit {
  // set the currenr year
  year: number = new Date().getFullYear();
  // Carousel navigation arrow show
  showNavigationArrows: any;
  loginForm!: UntypedFormGroup;
  submitted = false;
  error = '';
  returnUrl!: string;
  layout_mode!: string;
  fieldTextType!: boolean;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private authService: AuthfakeauthenticationService,
    private toastr: ToastrService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.layout_mode = LAYOUT_MODE;
    if (this.layout_mode === 'dark') {
      document.body.setAttribute('data-bs-theme', 'dark');
    }
    //Validation Set
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    document.body.setAttribute('data-layout', 'vertical');
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Form submit
   */
  onSubmit() {
    if (this.loginForm.valid) {
      this.submitted = true;
      this.authenticationService
        .login(this.loginForm.value)
        .subscribe((res) => {
          if (res.statusCode == 200) {
            this.toastr.success('Success', 'Logged Succesfully');
            sessionStorage.setItem('token', res.message.access_token);
            sessionStorage.setItem('username', res.message.user_info.firstname);
            sessionStorage.setItem('id', res.message.user_info.userId);
            sessionStorage.setItem('roles', res.message.user_info.roles);
            localStorage.setItem(
              'roles',
              JSON.stringify(res.message.user_info.roles)
            );
            localStorage.setItem(
              'user_info',
              JSON.stringify(res.message.user_info)
            );
            this.router.navigate(['/']);
          } else {
            this.toastr.error(res.message, 'Error');
          }
        });
    } else {
      this.toastr.error('Provide all login credentials', 'Error');
    }

    // stop here if form is invalid

    // if (this.loginForm.invalid) {
    //   return;
    // } else {
    //   this.authenticationService.login(this.loginForm.value).subscribe((res) => {
    //     sessionStorage.setItem("token", res.message.access_token)
    //     sessionStorage.setItem("username", res.message.user_info.firstname)
    //     this.router.navigate(['/'])
    //   })

    //   console.log(this.loginForm.value,'empty or not')
    // }
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('id');
  }

  /**
   * Password Hide/Show
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
