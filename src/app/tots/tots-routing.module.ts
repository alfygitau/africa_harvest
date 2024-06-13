import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TotProfileComponent } from './tot-profile/tot-profile.component';

const routes: Routes = [
  {
    path:'profile/:id',
    component: TotProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TotsRoutingModule { }
