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
import { Route, Router } from '@angular/router';
import { Tot, Trainer } from 'src/app/core/models/tot.model';
import { NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { UsersService } from 'src/app/users/users.service';
import { switchMap } from 'rxjs';

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

  updateForm!: FormGroup;
  selectedRows = new Set<number>();

  dataParams: any = {
    page_num: 1,
    page_size: 10,
  };

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private totsService: TotsService,
    private usersService: UsersService,
    private router: Router,
    private modalService: NgbModal
  ) {}
  ngOnInit(): void {
    const date = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    this.dataParams.page_num = 1;
    this.dataParams.page_size = 10;

    this.counties = counties;
    this.breadCrumbItems = [
      { label: 'Reports' },
      { label: 'ToTs', active: true },
    ];

    this.searchForm = this.formBuilder.group({
      startDate: [this.formatDate(startDate), Validators.required],
      endDate: [this.formatDate(date), Validators.required],
      countyId: [[], Validators.required],
      subCountyId: [[], Validators.required],
      wardId: [[], Validators.required],
    });

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

    this.getUsers();
    // this.onSubmit();

    // Trigger fetch when form changes or on initialization
    this.searchForm.valueChanges
      .pipe(switchMap(async () => this.onSubmit()))
      .subscribe();
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

  onSubmit() {
    let data = {
      page: this.dataParams.page_num,
      dataObj: this.searchForm.value,
      size: this.dataParams.page_size,
    };
    this.totsService.getTotsByLocations(data).subscribe((res) => {
      if (res.statusCode == 200) {
        this.rows = res.message;
        this.cdr.markForCheck();
      }
    });
  }

  setPage(pageInfo: any) {
    // this.dataParams.page_num = pageInfo.offset + 1;
    this.dataParams.page_num = pageInfo;
    let data = {
      page: this.dataParams.page_num,
      dataObj: this.searchForm.value,
      size: this.dataParams.page_size,
    };
    this.totsService.getTotsByLocations(data).subscribe((res) => {
      this.rows = res.message;
    });
  }

  getUsers() {
    this.totsService
      .getAllToTs(this.dataParams.page_num, this.dataParams.page_size)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.rows = res.message;
          // this.filteredArray = this.rows
          this.cdr.markForCheck();
          // console.log(this.rows)
        }
      });
  }

  subCounties(event: Event) {
    let ids = this.searchForm.get('countyId')?.value;
    let filtered_array = this.counties.filter((obj: any) =>
      ids.includes(obj.county_id)
    );
    filtered_array.forEach((element) => {
      this.sub_counties = this.sub_counties.concat(element.sub_counties);
    });
    this.onSubmit();
  }

  filterWards(event: Event) {
    let ids = this.searchForm.get('subCountyId')?.value;
    let filtered_array = this.sub_counties.filter((obj: any) =>
      ids.includes(obj.subCountyId)
    );
    filtered_array.forEach((element) => {
      this.wards = this.wards.concat(element.wards);
    });
    this.onSubmit();
  }
  onWardSelect() {
    this.onSubmit();
  }

  view(row: Tot) {
    this.router.navigate([`tots/profile/${row.userId}`]);
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
      console.log(res);
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
    let data = {
      page: 1,
      dataObj: this.searchForm.value,
      size: 50,
    };
    this.totsService.exportAllMembers(data).subscribe((res) => {
      console.log(res);
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
}
