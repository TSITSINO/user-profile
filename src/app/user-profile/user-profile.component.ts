import { Component, inject } from '@angular/core';
import { UserService } from '../sevices/user-profile.service';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [MatButtonModule, CommonModule, MatCardModule, RouterModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent {
  private readonly userService = inject(UserService);
  user$: Observable<User> = this.userService.getUserProfile();
}
