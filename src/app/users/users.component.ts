import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { UsersService } from './users.service';
import { UserInfo } from '../core/models/auth.models';
import { CommonModule } from '@angular/common';
import { PaginationModule } from '../pagination/pagination.module';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { County } from '../shared/data/county.model';
import { SubCounty } from '../shared/data/subCounty.model';
import { Ward } from '../shared/data/ward.model';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    SharedModule,
    NgbModule,
    CommonModule,
    PaginationModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  public breadCrumbItems!: Array<{}>;

  public users: UserInfo[] = [];
  public size: number = 1;
  public limit: number = 10;
  public totalUsers: number = 0;
  public selectedExportOption: string = 'CSV';
  public searchText: string = '';
  roles: string | null = null;

  counties: County[] = [];
  subCounties: SubCounty[] = [];
  wards: Ward[] = [];
  updateUserForm: FormGroup;

  public selectedUser!: UserInfo;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {
    this.updateUserForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      idNumber: ['', Validators.required],
      dateOfBirth: [this.formatDate(new Date()), Validators.required],
      phoneNumber: ['', Validators.required],
      gender: ['', Validators.required],
      countyTitle: ['', Validators.required],
      subcountyTitle: ['', Validators.required],
      wardTitle: ['', Validators.required],
      role: ['', Validators.required],
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
      { label: 'Userslist', active: true },
    ];
    this.fetchUsers();

    const roles = localStorage.getItem('roles');
    this.roles = roles ? JSON.parse(roles) : '';
  }
  onParamsChange() {
    this.fetchUsers();
  }
  centerModal(userModal: any, user: UserInfo) {
    this.selectedUser = user;

    this.updateUserForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      idNumber: user.idNumber,
      dateOfBirth: this.formatDate(new Date(user.dob)),
      phoneNumber: user.msisdn,
      gender: user.gender,
      countyTitle: user.countyTitle,
      subcountyTitle: user.subcountyTitle,
      wardTitle: user?.wardTitle,
      role: user?.userTypeId,
    });
    this.modalService.open(userModal, {
      centered: true,
      windowClass: 'modal-user-holder',
      size: 'lg',
    });

    this.getCounties();

    const countyControl = this.updateUserForm.get('county');
    const subcountyControl = this.updateUserForm.get('subcounty');

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
  }

  findUser() {}
  navigateToProfile(user: UserInfo) {
    this.router.navigate(['/users', user?.msisdn]);
  }
  navigateToAddUser() {
    this.router.navigate(['/users/add-user']);
  }
  async handleSubmit(event: Event) {
    event.preventDefault();
    if (this.roles?.includes('Admin') || this.roles?.includes('CIO')) {
      if (this.updateUserForm.valid) {
        const formData = {
          firstName: this.updateUserForm.value.firstName,
          lastName: this.updateUserForm.value.lastName,
          gender: this.updateUserForm.value.gender,
          idNumber: this.updateUserForm.value.idNumber,
          dob: this.updateUserForm.value.dateOfBirth,
          email: this.updateUserForm.value.email,
          msisdn: this.updateUserForm.value.phoneNumber,
          username: this.updateUserForm.value.username,
          userTypeId: this.updateUserForm.value.role,
        };
        await this.usersService
          .updateUser(this.selectedUser?.username, formData)
          .subscribe(
            (res) => {
              this.updateUserForm.reset();
              this.toastr.success('Success', 'User updated successfully');
            },
            (error) => {
              console.error('Error:', error);
              this.toastr.error('Error', 'Failed to update user');
            }
          );
      }
    } else {
      this.toastr.error('You do not have permission to update a user');
    }
  }
  fetchUsers() {
    this.usersService.getUsers(this.size, this.limit).subscribe(
      (data: UserInfo[]) => {
        this.users = data;
        this.totalUsers = 350;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }
  onPageChange(page: number) {
    this.size = page;
    this.fetchUsers();
  }

  filterUsers(): UserInfo[] {
    if (!this.searchText.trim()) {
      return this.users;
    }
    return this.users.filter(
      (user) =>
        user?.firstName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        user?.lastName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        user?.email.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
  getCounties(): void {
    this.counties = this.usersService.fetchCounties();
  }

  fetchSubcounties(countyId: number) {
    return this.usersService.fetchSubCounties(countyId);
  }
  fetchWards(subCountyId: number) {
    return this.usersService.getWards(subCountyId);
  }
}
