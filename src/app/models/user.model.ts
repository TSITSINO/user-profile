import { FormControl } from '@angular/forms';

export interface User {
  name: string | undefined | null;
  surname: string | undefined | null;
  email: string | undefined | null;
  phone?: string | undefined | null;
  profilePicture?: null | string;
}

export interface UserProfileForm {
  name: FormControl<string | null>;
  surname: FormControl<string | null>;
  email: FormControl<string | null>;
  phone: FormControl<string | null>;
  profilePicture: FormControl<string | null>;
}
