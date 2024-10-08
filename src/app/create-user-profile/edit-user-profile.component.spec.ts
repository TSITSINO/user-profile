import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditUserProfileComponent } from './edit-user-profile.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { UserService } from '../sevices/user-profile.service';

describe('EditUserProfileComponent', () => {
  let component: EditUserProfileComponent;
  let fixture: ComponentFixture<EditUserProfileComponent>;
  let userServiceMock: any;
  let snackBarMock: any;
  let routerMock: any;

  beforeEach(async () => {
    userServiceMock = jasmine.createSpyObj('UserService', [
      'getUserProfile',
      'updateUserProfile',
    ]);
    snackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    userServiceMock.getUserProfile.and.returnValue(
      of({
        name: 'Tsitsi',
        surname: 'Tsitsila',
        phone: '591234567',
        email: 'j@gmail.com',
        profilePicture: 'base64Image',
      })
    );

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, EditUserProfileComponent],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' }),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with user data', () => {
    expect(component.userForm.get('name')?.value).toBe('Tsitsi');
    expect(component.userForm.get('surname')?.value).toBe('Tsitsila');
    expect(component.userForm.get('phone')?.value).toBe('591234567');
    expect(component.userForm.get('email')?.value).toBe('j@gmail.com');
    expect(component.imgSrc()).toBe('base64Image');
  });

  it('should show error message if form is invalid', () => {
    component.userForm.get('name')?.setValue('');
    fixture.detectChanges();

    component.save();
    expect(snackBarMock.open).toHaveBeenCalledWith(
      'Please fill in the required fields',
      'X',
      { duration: 3000 }
    );
  });

  it('should call userService.updateUserProfile if form is valid', () => {
    component.userForm.get('name')?.setValue('Tsitsi');
    component.userForm.get('surname')?.setValue('Tsitsila');
    component.userForm.get('phone')?.setValue('591234567');
    component.userForm.get('email')?.setValue('j@gmail.com');

    const user = {
      name: 'Tsitsi',
      surname: 'Tsitsila',
      phone: '591234567',
      email: 'j@gmail.com',
      profilePicture: 'base64Image',
    };

    userServiceMock.updateUserProfile.and.returnValue(of({ success: true }));

    component.save();
    expect(userServiceMock.updateUserProfile).toHaveBeenCalledWith(user);
    expect(snackBarMock.open).toHaveBeenCalledWith(
      'The profile has been updated true',
      'X',
      { horizontalPosition: 'end', verticalPosition: 'top', duration: 3000 }
    );
    expect(routerMock.navigate).toHaveBeenCalledWith(['']);
  });

  it('should handle validation error on updateUserProfile', () => {
    userServiceMock.updateUserProfile.and.returnValue(
      throwError({ status: 422, error: { errors: ['Validation failed'] } })
    );

    component.save();

    expect(snackBarMock.open).toHaveBeenCalledWith(
      'Validation failed. Please check your input.',
      'X',
      { duration: 3000 }
    );
  });

  it('should handle server error on updateUserProfile', () => {
    userServiceMock.updateUserProfile.and.returnValue(
      throwError({ status: 500 })
    );

    component.save();

    expect(snackBarMock.open).toHaveBeenCalledWith(
      'An error occurred. Please try again later.',
      'X',
      { duration: 3000 }
    );
  });

  it('should delete the image when deleteImage is called', () => {
    component.imgSrc.set('someImage');
    component.deleteImage();
    expect(component.imgSrc()).toBeNull();
  });
});
