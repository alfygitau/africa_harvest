import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { UsersService } from '../users/users.service';
import { ActivatedRoute } from '@angular/router';
import { UserInfo } from '../core/models/auth.models';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  public breadCrumbItems!: Array<{}>;
  public userId!: string;
  public user!: UserInfo;

  activeTab: string = 'profile';

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Users' },
      { label: 'Profile', active: true },
    ];

    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('id')!;
    });

    this.fetchUserProfile();
  }
  selectTab(tab: string) {
    this.activeTab = tab;
  }

  fetchUserProfile() {
    this.usersService.getUserProfile(this.userId).subscribe(
      (data: UserInfo) => {
        this.user = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }
}
