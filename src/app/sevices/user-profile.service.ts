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
    const success = Math.random() > 0.2;
    if (success) {
      this.mockProfile = profile;
      localStorage.setItem('userFormData', JSON.stringify(profile));
      return of({ success: 'successfully' }).pipe(delay(2000));
    } else {
      return of({ error: 'Something went wrong' }).pipe(delay(2000));
    }
  }
}
