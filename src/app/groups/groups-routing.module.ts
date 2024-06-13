import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddGroupComponent } from './add-group/add-group.component';
import { GroupComponent } from './group/group.component';

const routes: Routes = [
  {
    path:'add-group',
    component: AddGroupComponent
  }, 
  {
    path:'group/:id',
    component: GroupComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule { }
