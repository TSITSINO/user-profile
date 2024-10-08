import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  mockProfile: User = {
    name: 'Tsitsino',
    surname: 'Tsitsilashvili',
    email: 'tsitsino@gmail.com',
    phone: '555555555',
    profilePicture: null,
  };

  getUserProfile(): Observable<User> {
    const savedFormData = localStorage.getItem('userFormData');

    if (savedFormData) {
      const parsedFormData = JSON.parse(savedFormData);
      this.mockProfile = parsedFormData;
    }

    return of(this.mockProfile).pipe(delay(100));
  }

  updateUserProfile(profile: User): Observable<any> {
    this.mockProfile = profile;
    return of({ success: true }).pipe(delay(2000));
  }
}
