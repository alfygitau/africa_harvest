import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ColumnMode, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TotsService } from 'src/app/tots/tots.service';
import { County } from 'src/app/shared/data/county.model';
import { SubCounty } from 'src/app/shared/data/subCounty.model';
import { Ward } from 'src/app/shared/data/ward.model';
import { counties } from 'src/app/shared/data/Counties';
import { Router } from '@angular/router';
import { Tot, Trainer } from 'src/app/core/models/tot.model';
import { NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { UsersService } from 'src/app/users/users.service';
import { GroupsService } from 'src/app/groups/groups.services';

// PrimeNG Modules
import { MultiSelectModule } from 'primeng/multiselect';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-tots',
  standalone: true,
  imports: [
    SharedModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxDatatableModule,
    FormsModule,
    CommonModule,
    NgbPagination,
    MultiSelectModule,
    CardModule,
  ],
  templateUrl: './tots.component.html',
  styleUrl: './tots.component.scss',
})
export class TotsComponent implements OnInit {
  public currentPage: number = 1;
  breadCrumbItems!: Array<{}>;
  searchForm!: FormGroup;
  counties: County[] = [];
  sub_counties: SubCounty[] = [];
  wards: Ward[] = [];
  ColumnMode = ColumnMode;
  rows: any = [];
  public selectedTrainer: Partial<Trainer> = {};
  public totalCounts: number = 1;
  countyName!: any
  role: any 
  userCountyId!: any

  updateForm!: FormGroup;
  selectedRows = new Set<number>();
  groups: any[] = [];
  dataParams: any = {
    page_num: 1,
    page_size: 10,
  };

  public selectedCounty: any[] = [];
  myCounties: any[] = [];
  subcountyOptions = [{ subCountyId: 1, name: 'Select a subcounty' }];
  wardOptions = [{ wardId: 1, name: 'Select a ward' }];
  myGroups: any = [{ subCountyId: 1, name: 'Select a group' }];
  selectedSubcounty: [] = [];
  selectedWard: [] = [];
  selectedGroup: [] = [];

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private totsService: TotsService,
    private usersService: UsersService,
    private groupsService: GroupsService,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.userCountyId = sessionStorage.getItem('userCountyId') || 0
    this.role = localStorage.getItem('roles')
  }
  ngOnInit(): void {
    const date = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 5);
    this.dataParams.page_num = 1;
    this.dataParams.page_size = 10;

    this.counties = counties;
    this.myCounties = this.transformCounties(counties);
    this.breadCrumbItems = [
      { label: 'Reports' },
      { label: 'ToTs', active: true },
    ];
    if(this.role.includes('CIO')) {
      console.log(this.selectedCounty)
      this.countyName = counties.filter((county) => county.county_id === parseInt(this.userCountyId))
      this.selectedCounty = [{ county_id: parseInt(this.userCountyId), name: this.countyName[0].name}]
      console.log(this.countyName[0].name)
      this.searchForm = this.formBuilder.group({
        countyId: [[this.selectedCounty], Validators.required],
        subCountyId: [[], Validators.required],
        wardId: [[], Validators.required],
        groupId: [[], Validators.required],
      });
      this.searchForm.get('countyId')?.disable() 
      let arr = this.counties.filter((county:any) => county.county_id === this.selectedCounty[0].county_id)
      this.subcountyOptions = arr[0].sub_counties
    } else {
      this.searchForm = this.formBuilder.group({
        startDate: [this.formatDate(startDate), Validators.required],
        endDate: [this.formatDate(date), Validators.required],
        countyId: [[], Validators.required],
        subCountyId: [[], Validators.required],
        wardId: [[], Validators.required],
      });

    }


    this.updateForm = this.formBuilder.group({
      dob: ['', Validators.required],
      email: ['', Validators.required],
      gender: ['', Validators.required],
      msisdn: ['', Validators.required],
      idNumber: ['', Validators.required],
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      wardTitle: ['', Validators.required],
      countyTitle: ['', Validators.required],
      subCountyTitle: ['', Validators.required],
    });

    this.searchForm.valueChanges.subscribe(() => {
      let obj = {
        countyId: this.searchForm
          .get('countyId')
          ?.value.map((county: any) => county.county_id),
        subCountyId: this.searchForm
          .get('subCountyId')
          ?.value.map((subCounty: any) => subCounty.subCountyId),
        wardId: this.searchForm
          .get('wardId')
          ?.value.map((ward: any) => ward.wardId),
        groupId: this.searchForm
          .get('groupId')
          ?.value.map((group: any) => group.group_id),
        startDate: this.searchForm.get('startDate')?.value
          ? this.searchForm.get('startDate')?.value
          : '',
        endDate: this.searchForm.get('endDate')?.value
          ? this.searchForm.get('endDate')?.value
          : '',
        userTypeId: 2,
      };
      let data = {
        page: this.dataParams.page_num,
        dataObj: obj,
        size: this.dataParams.page_size,
      };
      this.filterGroups(obj);
      this.onSubmit(data);
    });

    let obj = {
      countyId: this.searchForm
        .get('countyId')
        ?.value.map((county: any) => county.county_id),
      subCountyId: this.searchForm
        .get('subCountyId')
        ?.value.map((subCounty: any) => subCounty.subCountyId),
      wardId: this.searchForm
        .get('wardId')
        ?.value.map((ward: any) => ward.wardId),
      groupId: this.searchForm
        .get('groupId')
        ?.value.map((group: any) => group.group_id),
      startDate: this.searchForm.get('startDate')?.value
        ? this.searchForm.get('startDate')?.value
        : '',
      endDate: this.searchForm.get('endDate')?.value
        ? this.searchForm.get('endDate')?.value
        : '',
      userTypeId: 2,
    };
    let data = {
      page: this.dataParams.page_num,
      dataObj: obj,
      size: this.dataParams.page_size,
    };

    this.onSubmit(data);
  }

  filter(value: any) {
    const selectedCountyIds = value?.map((county: any) => county.county_id);
    if (selectedCountyIds) {
      const filteredSubcounties = this.counties
        .filter((county) => selectedCountyIds.includes(county.county_id))
        .flatMap((county) => county.sub_counties);
      console.log(filteredSubcounties);
      this.subcountyOptions = [
        { subCountyId: 1, name: 'Select a subcounty' },
        ...filteredSubcounties,
      ];
      this.wardOptions = [{ wardId: 1, name: 'Select a ward' }];
    }
  }

  filterWards(selectedSubcounties: any[]) {
    this.wardOptions = [{ wardId: 1, name: 'Select a ward' }];
    selectedSubcounties.forEach((subcounty) => {
      if (subcounty && subcounty.wards) {
        this.wardOptions.push(...subcounty.wards);
      }
    });
  }

  transformCounties(data: any) {
    return data.map((county: any) => ({
      label: county.name,
      value: county.county_id,
    }));
  }

  handleSubmit(event: Event) {}

  selectAll(event: any) {
    const checked = event.target.checked;
    if (checked) {
      this.rows.forEach((row: any) =>
        this.selectedRows.add(row.member_id || row?.userId)
      );
    } else {
      this.selectedRows.clear();
    }
  }

  onRowSelect(event: any, row: any) {
    const checked = event.target.checked;
    if (checked) {
      this.selectedRows.add(row.member_id || row?.userId);
    } else {
      this.selectedRows.delete(row.member_id || row?.userId);
    }
  }

  isSelected(rowId: number): boolean {
    return this.selectedRows?.has(rowId);
  }

  centerModal(userModal: any, trainer: Trainer) {
    this.selectedTrainer = trainer;
    console.log(this.selectedTrainer);

    if (this.selectedTrainer.county_id !== undefined) {
      this.sub_counties = this.fetchSubcounties(this.selectedTrainer.county_id);
    }

    if (this.selectedTrainer.sub_county_id !== undefined) {
      this.wards = this.fetchWards(this.selectedTrainer.sub_county_id);
    }

    this.updateForm.patchValue({
      firstName: this.selectedTrainer.first_name,
      lastName: this.selectedTrainer.last_name,
      email: this.selectedTrainer.email,
      idNumber: this.selectedTrainer.id_number,
      dob: this.selectedTrainer.dob
        ? this.formatDate(new Date(this.selectedTrainer.dob))
        : null,
      msisdn: this.selectedTrainer.msisdn,
      gender: this.selectedTrainer.gender,
      countyTitle: this.selectedTrainer.county_title,
      subCountyTitle: this.selectedTrainer.sub_county_title,
      wardTitle: this.selectedTrainer?.ward_name,
    });

    this.modalService.open(userModal, {
      centered: true,
      windowClass: 'modal-user-holder',
      size: 'lg',
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

  onSubmit(data: any) {
    this.totsService.getTotsByLocations(data).subscribe((res) => {
      if (res.statusCode == 200) {
        this.rows = res.message.tots;
        this.totalCounts = res.message.totalCount;
        this.cdr.markForCheck();
      }
    });
  }

  setPage(pageInfo: any) {
    this.dataParams.page_num = pageInfo;
    let obj = {
      countyId: this.searchForm
        .get('countyId')
        ?.value.map((county: any) => county.county_id),
      subCountyId: this.searchForm
        .get('subCountyId')
        ?.value.map((subCounty: any) => subCounty.subCountyId),
      wardId: this.searchForm
        .get('wardId')
        ?.value.map((ward: any) => ward.wardId),
      groupId: this.searchForm
        .get('groupId')
        ?.value.map((group: any) => group.group_id),
      startDate: this.searchForm.get('start_date')?.value
        ? this.searchForm.get('start_date')?.value
        : '',
      endDate: this.searchForm.get('end_date')?.value
        ? this.searchForm.get('end_date')?.value
        : '',
      userTypeId: 2,
    };

    let data = {
      page: this.dataParams.page_num,
      dataObj: obj,
      size: this.dataParams.page_size,
    };
    this.totsService.getTotsByLocations(data).subscribe((res) => {
      this.rows = res.message.tots;
      this.totalCounts = res.message.totalCount;
    });
  }

  // getUsers() {
  //   this.totsService
  //     .getAllToTs(this.dataParams.page_num, this.dataParams.page_size)
  //     .subscribe((res) => {
  //       if (res.statusCode == 200) {
  //         console.log(res.message);
  //         this.rows = res.message;
  //         this.cdr.markForCheck();
  //       }
  //     });
  // }

  subCounties(event: Event) {
    let ids = this.searchForm.get('countyId')?.value;
    let filtered_array = this.counties.filter((obj: any) =>
      ids.includes(obj.county_id)
    );
    filtered_array.forEach((element) => {
      this.sub_counties = this.sub_counties.concat(element.sub_counties);
    });
  }

  onWardSelect() {
    // this.onSubmit();
  }

  view(row: Tot) {
    this.router.navigate([`users/${row.msisdn}`]);
  }

  fetchSubcounties(countyId: number) {
    return this.usersService.fetchSubCounties(countyId);
  }
  fetchWards(subCountyId: number) {
    return this.usersService.getWards(subCountyId);
  }
  exportSelectedMembers() {
    let data = {
      userId: Array.from(this.selectedRows),
    };
    this.totsService.exportMembers(data).subscribe((res) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(res);
      a.href = objectUrl;
      a.download = 'Tots.xlsx';
      a.click();
      URL.revokeObjectURL(objectUrl);
      this.cdr.markForCheck();
      this.cdr.markForCheck();
    });
  }
  exportEntireMembersReport() {
    let obj = {
      countyId: this.searchForm
        .get('countyId')
        ?.value.map((county: any) => county.county_id),
      subCountyId: this.searchForm
        .get('subCountyId')
        ?.value.map((subCounty: any) => subCounty.subCountyId),
      wardId: this.searchForm
        .get('wardId')
        ?.value.map((ward: any) => ward.wardId),
      groupId: this.searchForm
        .get('groupId')
        ?.value.map((group: any) => group.group_id),
      startDate: this.searchForm.get('start_date')?.value
        ? this.searchForm.get('start_date')?.value
        : '',
      endDate: this.searchForm.get('end_date')?.value
        ? this.searchForm.get('end_date')?.value
        : '',
      userTypeId: 2,
    };
    let data = {
      page: 1,
      dataObj: obj,
      size: 100000,
    };
    this.totsService.exportAllMembers(data).subscribe((res) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(res);
      a.href = objectUrl;
      a.download = 'Tots.xlsx';
      a.click();
      URL.revokeObjectURL(objectUrl);
      this.cdr.markForCheck();
      this.cdr.markForCheck();
    });
  }
  filterGroups(data: any) {
    if (this.searchForm) {
      this.groupsService.getGroupsByLocation(data).subscribe((res) => {
        if (res.statusCode == 200) {
          this.groups = res.message;
          this.cdr.markForCheck();
          this.myGroups = [
            { group_id: 1, name: 'Select a group' },
            ...res.message.map((group: any) => ({
              group_id: group.group_id,
              name: group.group_name,
              ward_id: group.ward_id,
              description: group.description,
              group_admin_name: group.group_admin.name,
            })),
          ];
        }
      });
    }
  }
}
