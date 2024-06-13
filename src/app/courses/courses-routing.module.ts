import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTrainingComponent } from './add-training/add-training.component';
import { TrainingsComponent } from './trainings/trainings.component';

const routes: Routes = [
  {
    path:'add-training',
    component: AddTrainingComponent
  },
  {
    path:'trainings',
    component: TrainingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule { }
