import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { FormsModule } from '@angular/forms';
import { UsersService } from './users.service';
import { UsersComponent } from './users.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, UsersRoutingModule, FormsModule, UsersComponent],
  providers: [UsersService],
  exports: [UsersComponent],
})
export class UsersModule {}
