import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TotComponent } from './tot/tot.component';
import { FarmerComponent } from './farmer/farmer.component';

const routes: Routes = [
  {
    path:'tot',
    component: TotComponent
  }, 
  {
    path:'farmer',
    component:FarmerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeedsDistRoutingModule { }
