import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { CredentialsDTO } from '../../model/auth/credentials-dto';
import { sha256 } from '../utils/hash';
import { ThemeService, Theme } from '../services/theme.service';

interface RegisterForm {
  handle: FormControl<string | null>;
  displayName: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
}

export function handleValidator(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) return of(null);

    const value: string = control.value;
    if (/[A-Z]/.test(value))        return of({ handleUppercase: true });
    if (/[^a-z0-9_]/.test(value))   return of({ handleInvalidChars: true });
    if (/\s/.test(value))           return of({ handleSpaces: true });

    return userService.checkHandleAvailability(value).pipe(
      map(res => res.available ? null : { handleTaken: true }),
      catchError(() => of(null))
    );
  };
}

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value || '';
    const errors: ValidationErrors = {};
    if (value.length < 8)             errors['minlength'] = { requiredLength: 8 };
    if (value.length > 16)             errors['maxlength'] = { requiredLength: 16 };
    if (!/[a-z]/.test(value))          errors['lowercase'] = true;
    if (!/[A-Z]/.test(value))          errors['uppercase'] = true;
    if (!/[^a-zA-Z0-9]/.test(value))   errors['specialChar'] = true;
    return Object.keys(errors).length ? errors : null;
  };
}

export function displayNameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value || '';
    return value.trim().length === 0 ? { displayNameEmpty: true } : null;
  };
}

export function confirmPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control.parent as FormGroup;
    if (!formGroup) return null;
    const password = formGroup.get('password')?.value;
    const confirmPassword = control.value;
    return password && confirmPassword && password !== confirmPassword
      ? { passwordsMismatch: true }
      : null;
  };
}

@Component({
  selector: 'app-register-view',
  standalone: false,
  templateUrl: './register-view.html',
  styleUrl: './register-view.css',
})
export class RegisterView implements OnInit, OnDestroy {
  errorMessage: string = '';
  currentTheme!: Theme;
  private themeSubscription!: Subscription;
  private authSubscription!: Subscription;

  registerForm = new FormGroup<RegisterForm>({
    handle: new FormControl('', [Validators.required, Validators.maxLength(16)], [handleValidator(inject(UserService))]),
    displayName: new FormControl('', [Validators.required, displayNameValidator()]),
    password: new FormControl('', [Validators.required, passwordValidator()]),
    confirmPassword: new FormControl('', [Validators.required, confirmPasswordValidator()]),
  })

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themeSubscription = this.themeService.currentTheme$.subscribe(
      (theme) => {
        this.currentTheme = theme;
      }
    );

    this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  getErrorMessage(field: string): string {
    const control = this.registerForm.get(field);
    if (!control || !control.errors || !control.touched) return '';

    if (control.hasError('required')) {
      const labels: Record<string, string> = {
        handle: 'Handle', displayName: 'Display name',
        password: 'Password', confirmPassword: 'Password confirmation'
      };
      return `${labels[field] || field} is required`;
    }
    if (control.hasError('handleUppercase')) return 'Handle cannot contain uppercase letters';
    if (control.hasError('handleInvalidChars')) return 'Handle can only contain lowercase letters, numbers, and underscores';
    if (control.hasError('handleSpaces')) return 'Handle cannot contain spaces';
    if (control.hasError('displayNameEmpty')) return 'Display name cannot be empty';
    if (control.hasError('handleTaken')) return 'This handle is already taken';
    if (control.hasError('minlength')) return `Must be at least ${control.getError('minlength').requiredLength} characters`;
    if (control.hasError('maxlength')) return `Must be at most ${control.getError('maxlength').requiredLength} characters`;
    if (control.hasError('lowercase')) return 'Must contain a lowercase letter';
    if (control.hasError('uppercase')) return 'Must contain an uppercase letter';
    if (control.hasError('specialChar')) return 'Must contain a special character';
    if (field === 'confirmPassword' && control.hasError('passwordsMismatch')) return 'Passwords do not match';

    return '';
  }

  async onRegister() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Please fill in all fields correctly';
      return;
    }

    const { handle, displayName, password } = this.registerForm.value;
    const hashedPassword = await sha256(password!);
    const credentials = new CredentialsDTO(handle!, hashedPassword, displayName!);
    this.userService.register(credentials).subscribe({
      next: () => {
        this.authService.login(credentials).subscribe({
          next: () => {
            this.router.navigate(['/profile/edit']);
          },
          error: () => {
            this.router.navigate(['/login']);
          }
        });
      },
      error: (err) => {
        this.errorMessage = 'Registration failed. The handle may already be taken.';
        console.error('Registration error:', err);
      }
    });
  }

  onLogin() {
    this.router.navigate(['/login']);
  }
}
