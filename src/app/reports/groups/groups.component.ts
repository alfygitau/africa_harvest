import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SubCounty } from 'src/app/shared/data/subCounty.model';
import { SharedModule } from '../../shared/shared.module';
import { County } from '../../shared/data/county.model';
import { Ward } from '../../shared/data/ward.model';
import { counties } from 'src/app/shared/data/Counties';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GroupsService } from 'src/app/core/services/groups.service';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ColumnMode, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    NgxDatatableModule,
    NgbPagination
  ],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss',
})
export class GroupsComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  searchForm!: FormGroup;
  counties: County[] = [];
  sub_counties: SubCounty[] = [];
  wards: Ward[] = [];
  groups = [];
  ColumnMode = ColumnMode;
  public columns = [];
  dataParams: any = {
    page_num: '',
    page_size: '',
  };
  public size: number = 1;
  public limit: number = 10;
  public totalGroups: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private groupsService: GroupsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const date = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    this.dataParams.page_num = 0;
    this.dataParams.page_size = 10;

    this.counties = counties;
    this.breadCrumbItems = [
      { label: 'Reports' },
      { label: 'Groups', active: true },
    ];

    this.searchForm = this.formBuilder.group({
      start_date: [this.formatDate(startDate), Validators.required],
      end_date: [this.formatDate(date), Validators.required],
      countyId: [[], Validators.required],
      subCountyId: [[], Validators.required],
      wardId: [[], Validators.required],
      groupId: [[], Validators.required],
    });

    this.getGroups();
  }

  edit(row: any) {
    console.log(row);
  }

  onPageChange(page: number) {
    this.size = page;
    this.getGroups();
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

  viewGroupDetails(row: any) {
    console.log(row);
    sessionStorage.setItem('selected', JSON.stringify(row));
    this.router.navigate(['/groups/group/', row.group_id]);
  }

  getGroups() {
    // this.spinner.show()
    this.groupsService.getGroups(this.size, this.limit).subscribe((res) => {
      if (res.statusCode == 200) {
        this.totalGroups = 200;
        this.groups = res.message;
        this.cdr.markForCheck();
        // this.spinner.hide()
      }
    });
  }

  onSubmit() {
    // this.service.searchSalesReport(this.searchForm.value).subscribe((res)=>{
    //   this.rows = res;
    //     this.ref.markForCheck();
    // })
  }

  filtergroups(event: any) {
    let object = {
      countyId: this.searchForm.get('countyId')?.value,
      subCountyId: this.searchForm.get('subCountyId')?.value,
      wardId: this.searchForm.get('wardId')?.value,
      startDate: '',
      endDate: '',
    };
    this.groupsService.getGroupsByLocation(object).subscribe((res) => {
      console.log(res);
    });
  }

  filterGroups(data: any) {
    console.log(data)
    this.groupsService.getGroupsByLocation(data).subscribe((res) => {
      if (res.statusCode == 200) {
        this.groups = res.message;
        this.cdr.markForCheck();
      }
    });
  }

  search() {
    let obj = {
      countyId: this.searchForm.get('countyId')?.value,
      subCountyId: this.searchForm.get('subCountyId')?.value,
      wardId: this.searchForm.get('wardId')?.value,
      startDate: '',
      endDate: '',
    };
    this.filterGroups(obj);
  }

  subCounties() {
    let ids = this.searchForm.get('countyId')?.value;
    let filtered_array = this.counties.filter((obj: any) =>
      ids.includes(obj.county_id)
    );
    filtered_array.forEach((element) => {
      this.sub_counties = this.sub_counties.concat(element.sub_counties);
    });
    this.search()
  }

  filterWards(event: Event) {
    let ids = this.searchForm.get('subCountyId')?.value;
    let filtered_array = this.sub_counties.filter((obj: any) =>
      ids.includes(obj.subCountyId)
    );
    filtered_array.forEach((element) => {
      this.wards = this.wards.concat(element.wards);
    });

    this.search()
  }

  getWards() {
    let ids = this.searchForm.get('subCountyId')?.value;
    let filtered_array = this.sub_counties.filter((obj: any) =>
      ids.includes(obj.subCountyId)
    );
    filtered_array.forEach((element) => {
      this.wards = this.wards.concat(element.wards);
    });
    this.search()
  }

  onGroupSelect() {
    this.search()
  }

  setPage(pageInfo: any) {
    console.log(pageInfo);
    this.dataParams.page_num = pageInfo.offset + 1;
    this.groupsService
      .getDynamicGroups(this.dataParams.page_num)
      .subscribe((res) => {
        this.groups = res.message;
        this.cdr.markForCheck();
      });
  }
}
