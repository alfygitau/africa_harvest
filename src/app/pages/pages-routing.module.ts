import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AddTrainingComponent } from '../courses/add-training/add-training.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  // {
  //   path:'add-training',
  //   component: AddTrainingComponent
  // }

];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    
  ],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
