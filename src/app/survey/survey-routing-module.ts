import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveyComponent } from './survey.component';
import { SurveyListComponent } from '../survey-list/survey-list.component';

const routes: Routes = [
  {
    path: 'results',
    component: SurveyComponent,
  },
  {
    path: 'survey-list',
    component: SurveyListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SurveyRoutingModule {}
