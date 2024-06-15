import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ColumnMode, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { GroupsService } from 'src/app/core/services/groups.service';
import { counties } from 'src/app/shared/data/Counties';
import { County } from 'src/app/shared/data/county.model';
import { SubCounty } from 'src/app/shared/data/subCounty.model';
import { Ward } from 'src/app/shared/data/ward.model';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-seeds-distribution',
  standalone: true,
  imports: [
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    NgxDatatableModule,
    NgbPagination,
  ],
  templateUrl: './seeds-distribution.component.html',
  styleUrl: './seeds-distribution.component.scss',
})
export class SeedsDistributionComponent implements OnInit {
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
  public totalSeedDistributionReports: number = 0;
  public seedDistributionOverview = [];

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
      { label: 'Seed Distribution', active: true },
    ];

    this.searchForm = this.formBuilder.group({
      start_date: [this.formatDate(startDate), Validators.required],
      end_date: [this.formatDate(date), Validators.required],
      countyId: [[], Validators.required],
      subCountyId: [[], Validators.required],
      wardId: [[], Validators.required],
      groupId: [[], Validators.required],
    });

    this.fetchSeedDistributionOverview();
  }

  edit(row: any) {
    console.log(row);
  }

  onPageChange(page: number) {
    this.size = page;
    this.fetchSeedDistributionOverview();
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

  fetchSeedDistributionOverview() {
    // this.spinner.show()
    let object = {
      countyId: this.searchForm.get('countyId')?.value,
      subCountyId: this.searchForm.get('subCountyId')?.value,
      wardId: this.searchForm.get('wardId')?.value,
      startDate: this.searchForm.get('start_date')?.value,
      endDate: this.searchForm.get('end_date')?.value,
    };
    this.groupsService
      .getSeedDistributionReport()
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.totalSeedDistributionReports = 200;
          this.seedDistributionOverview = res.message;
          this.cdr.markForCheck();
          // this.spinner.hide()
        }
      });
  }

  search() {
    this.fetchSeedDistributionOverview();
  }

  subCounties() {
    let ids = this.searchForm.get('countyId')?.value;
    let filtered_array = this.counties.filter((obj: any) =>
      ids.includes(obj.county_id)
    );
    filtered_array.forEach((element) => {
      this.sub_counties = this.sub_counties.concat(element.sub_counties);
    });
  }

  filterWards(event: Event) {
    let ids = this.searchForm.get('subCountyId')?.value;
    let filtered_array = this.sub_counties.filter((obj: any) =>
      ids.includes(obj.subCountyId)
    );
    filtered_array.forEach((element) => {
      this.wards = this.wards.concat(element.wards);
    });
  }

  getWards() {
    let ids = this.searchForm.get('subCountyId')?.value;
    let filtered_array = this.sub_counties.filter((obj: any) =>
      ids.includes(obj.subCountyId)
    );
    filtered_array.forEach((element) => {
      this.wards = this.wards.concat(element.wards);
    });
  }

  setPage(pageInfo: any) {
    console.log(pageInfo);
    this.dataParams.page_num = pageInfo.offset + 1;
    this.groupsService
      .getDynamicGroups(this.dataParams.page_num)
      .subscribe((res) => {
        this.groups = res.message;
        // this.spinner.hide()
        this.cdr.markForCheck();
      });
  }
}
