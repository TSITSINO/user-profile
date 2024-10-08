import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserService } from '../sevices/user-profile.service';
import { Router, RouterModule } from '@angular/router';
import { UserProfileForm } from '../models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-create-user-profile',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './edit-user-profile.component.html',
  styleUrl: './edit-user-profile.component.scss',
})
export class EditUserProfileComponent implements OnInit {
  private readonly userService = inject(UserService);
  private router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private _snackBar = inject(MatSnackBar);
  public readonly loading$ = new BehaviorSubject(false);

  public imgSrc: WritableSignal<string | null> = signal(null);

  userForm = new FormGroup<UserProfileForm>({
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    phone: new FormControl(null, [
      Validators.pattern('^[0-9]*$'),
      this.phoneNumberValidator(),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    profilePicture: new FormControl(null),
  });

  phoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const valid = /^5\d{8}$/.test(value);
      return valid ? null : { invalidPhoneNumber: true };
    };
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validImageTypes.includes(file.type)) {
        this._snackBar.open('Only JPG, PNG, and GIF images are allowed', 'X', {
          duration: 3000,
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const base64Image = e.target?.result as string;
        this.userForm.get('profilePicture')?.setValue(base64Image);
        this.imgSrc.set(base64Image);
      };
      reader.readAsDataURL(file);
    }
  }

  deleteImage() {
    this.imgSrc.set(null);
    this.userForm.get('profilePicture')?.setValue(null);
  }

  save() {
    if (this.userForm.valid) {
      const user = {
        name: this.userForm.get('name')?.value,
        surname: this.userForm.get('surname')?.value,
        phone: this.userForm.get('phone')?.value ?? null,
        email: this.userForm.get('email')?.value,
        profilePicture: this.userForm.get('profilePicture')?.value,
      };

      if (user) this.loading$.next(true);
      this.userService
        .updateUserProfile(user)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(
          (response) => {
            this.loading$.next(false);
            this._snackBar.open(
              'The profile has been updated ' + `${response.success}`,
              'X',
              {
                horizontalPosition: 'end',
                verticalPosition: 'top',
                duration: 3000,
              }
            );

            this.router.navigate(['']);
          },
          (error) => {
            if (error.status === 422) {
              console.log('Validation errors:', error.error.errors);
              this._snackBar.open(
                'Validation failed. Please check your input.',
                'X',
                { duration: 3000 }
              );
            } else {
              this._snackBar.open(
                'An error occurred. Please try again later.',
                'X',
                { duration: 3000 }
              );
            }
          }
        );
    } else {
      this._snackBar.open('Please fill in the required fields', 'X', {
        duration: 3000,
      });
      this.userForm.markAllAsTouched();
    }
  }

  ngOnInit(): void {
    this.userService
      .getUserProfile()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((profile) => {
        this.userForm.patchValue(profile);
        if (this.userForm.value['profilePicture'])
          this.imgSrc.set(this.userForm.value['profilePicture']);
      });

    // this.userForm.valueChanges
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe((formData) => {
    //     localStorage.setItem('userFormData', JSON.stringify(formData));
    //   });
  }
}
