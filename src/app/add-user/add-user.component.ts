import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { PaginationModule } from '../pagination/pagination.module';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UsersService } from '../users/users.service';
import { County, NewCounty, SuperSubCounty } from '../shared/data/county.model';
import { counties } from '../shared/data/Counties';
import { SubCounty } from '../shared/data/subCounty.model';
import { Ward } from '../shared/data/ward.model';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [SharedModule, CommonModule, PaginationModule, ReactiveFormsModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
})
export class AddUserComponent implements OnInit {
  @ViewChild('userModal') userModal: any;
  public breadCrumbItems!: Array<{}>;
  userForm: FormGroup;
  isCIO: boolean = false;
  isDisabled: boolean = true;
  allRoles: any = [];
  userTypes: any = [];
  userId = '';
  selectedRole: number | null = null;

  counties: County[] = [];
  subCounties: SubCounty[] = [];
  wards: Ward[] = [];
  public roles: string | null = null;
  public cio_county: any = null;
  public cio_county_id: any = null;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      idNumber: ['', Validators.required],
      dateOfBirth: [this.formatDate(new Date()), Validators.required],
      phoneNumber: ['', Validators.required],
      role: ['', Validators.required],
      userType: ['', Validators.required],
      gender: ['', Validators.required],
      county: ['', Validators.required],
      subcounty: ['', Validators.required],
      ward: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }
  private formatDate(date: Date): string {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Users' },
      { label: 'Add user', active: true },
    ];
    this.getCounties();
    this.fetchAllRoles();
    this.fetchAllUserTypes();
    const countyControl = this.userForm.get('county');
    const subcountyControl = this.userForm.get('subcounty');

    if (countyControl) {
      countyControl.valueChanges.subscribe((countyId) => {
        this.subCounties = this.usersService.fetchSubCounties(Number(countyId));
      });
    }

    if (subcountyControl) {
      subcountyControl.valueChanges.subscribe((subcountyId) => {
        this.wards = this.usersService.getWards(Number(subcountyId));
      });
    }

    const roles = localStorage.getItem('roles');
    this.roles = roles ? JSON.parse(roles) : '';
    const user = localStorage.getItem('user_info');
    let user_info = user ? JSON.parse(user) : '';
    this.cio_county = user_info?.countyTitle;

    let county = this.counties.find(
      (c) => c?.name === this.cio_county.toUpperCase()
    );
    this.cio_county_id = county?.county_id;
    this.isCIO = this.roles ? this.roles.includes('CIO') : false;

    this.userForm.patchValue({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      idNumber: '',
      dateOfBirth: this.formatDate(new Date()),
      phoneNumber: '',
      role: '',
      gender: '',
      county: this.cio_county_id,
      subcounty: '',
      ward: '',
      password: '',
      confirmPassword: '',
    });
  }
  async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.roles?.includes('Admin') || this.roles?.includes('CIO')) {
      if (
        this.userForm.value.password === this.userForm.value.confirmPassword
      ) {
        const formData = {
          firstName: this.userForm.value.firstName,
          lastName: this.userForm.value.lastName,
          gender: this.userForm.value.gender,
          idNumber: this.userForm.value.idNumber,
          dob: this.userForm.value.dateOfBirth,
          email: this.userForm.value.email,
          msisdn: this.userForm.value.phoneNumber,
          username: this.userForm.value.username,
          password: this.userForm.value.password,
          userTypeId: Number(this.userForm.value.userType),
          wardId: Number(this.userForm.value.ward),
        };
        await this.usersService.createUser(formData).subscribe(
          (res: any) => {
            if (res?.statusCode === 201) {
              this.userId = res.message.ID;
              // this.userForm.reset();
              // this.userForm.value.role = '';
              this.modalService.open(this.userModal, {
                centered: true,
                windowClass: 'modal-user-holder',
                size: 'md',
              });
            } else {
              this.toastr.error('Error', res.message);
            }
          },
          (error) => {
            console.error('Error:', error);
            this.toastr.error('Error', 'Failed to add user');
          }
        );
      } else {
        this.toastr.error('Error', 'Passwords do not match');
      }
    } else {
      this.toastr.error('You have no permission to create users', 'Error');
    }
  }

  getCounties(): void {
    this.counties = this.usersService.fetchCounties();
  }

  fetchAllRoles() {
    this.usersService.getAllRoles().subscribe((res) => {
      this.allRoles = res.message;
      if (this.allRoles.length > 0) {
        this.userForm.patchValue({ role: this.allRoles[0].roleId });
      }
    });
  }

  fetchAllUserTypes() {
    this.usersService.getUserTypes().subscribe((res) => {
      this.userTypes = res.message;
    });
  }

  userRoleCreate() {
    let payload = {
      userId: this.userId,
      roleId: Number(this.userForm.value.role),
    };
    this.usersService.finalizeUserCreation(payload).subscribe((res) => {
      if (res.statusCode === 201 || res.statusCode === 200) {
        this.modalService.dismissAll();
        this.toastr.success('Success', 'User added successfully');
        this.router.navigate(['/users/userlist']);
      }
    });
  }
}
