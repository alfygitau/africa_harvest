import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyComponent } from './survey.component';
import { FormsModule } from '@angular/forms';
import { SurveyRoutingModule } from './survey-routing-module';
import { CountUpModule } from 'ngx-countup';
import { NgApexchartsModule } from "ng-apexcharts";
// PrimeNG Modules
import { MultiSelectModule } from 'primeng/multiselect';
import { CardModule } from 'primeng/card';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SurveyRoutingModule,
    FormsModule,
    SurveyComponent,
    CountUpModule,
    NgApexchartsModule,
    MultiSelectModule,
    CardModule
  ],
  providers: [],
  exports: [SurveyComponent],
})
export class SurveyModule {}
