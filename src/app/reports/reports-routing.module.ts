import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FarmersComponent } from './farmers/farmers.component';
import { TrainingsComponent } from './trainings/trainings.component';
import { GroupsComponent } from './groups/groups.component';
import { SeedsDistributionComponent } from './seeds-distribution/seeds-distribution.component';
import { TotsComponent } from './tots/tots.component';

const routes: Routes = [
  {
    path: 'farmers', 
    component: FarmersComponent
  },
  {
    path: 'trainings',
    component: TrainingsComponent
  }, 
  {
    path: 'groups',
    component: GroupsComponent
  },
  {
    path: 'seeds-distribution',
    component: SeedsDistributionComponent
  },
  {
    path: 'tots',
    component: TotsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
