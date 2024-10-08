import { Routes } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';

export const routes: Routes = [
  {
    path: '',
    component: UserProfileComponent,
  },
  {
    path: 'edit-profile',
    loadComponent: () =>
      import('./edit-user-profile/edit-user-profile.component').then(
        (m) => m.EditUserProfileComponent
      ),
  },
];
