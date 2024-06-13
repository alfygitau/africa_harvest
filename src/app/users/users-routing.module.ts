import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { AddUserComponent } from '../add-user/add-user.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';

const routes: Routes = [
  {
    path: 'userlist',
    component: UsersComponent,
  },
  {
    path: 'add-user',
    component: AddUserComponent,
  },
  {
    path: ':id',
    component: UserProfileComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
