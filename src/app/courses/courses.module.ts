import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesRoutingModule } from './courses-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SimplebarAngularModule } from 'simplebar-angular';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxEchartsModule } from 'ngx-echarts';


// import {MatTableModule} from '@angular/material/table';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    NgApexchartsModule,
    NgxEchartsModule,
    NgbDropdownModule,
    NgbNavModule,
    SimplebarAngularModule,
    CarouselModule,
    FeatherModule.pick(allIcons),
    LeafletModule,
    // MatTableModule
  ]
})
export class CoursesModule { }
