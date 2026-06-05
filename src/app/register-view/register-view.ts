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
import { TranslateService } from '@ngx-translate/core';

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
    private themeService: ThemeService,
    private translateService: TranslateService
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
        handle: 'AUTH.REGISTER.HANDLE_LABEL', displayName: 'AUTH.REGISTER.DISPLAY_NAME_LABEL',
        password: 'AUTH.REGISTER.PASSWORD_LABEL', confirmPassword: 'AUTH.REGISTER.CONFIRM_PASSWORD_LABEL'
      };
      const fieldLabel = this.translateService.instant(labels[field] || field);
      return this.translateService.instant('AUTH.REGISTER.ERRORS.REQUIRED', { field: fieldLabel });
    }
    if (control.hasError('handleUppercase')) return this.translateService.instant('AUTH.REGISTER.ERRORS.HANDLE_UPPERCASE');
    if (control.hasError('handleInvalidChars')) return this.translateService.instant('AUTH.REGISTER.ERRORS.HANDLE_INVALID_CHARS');
    if (control.hasError('handleSpaces')) return this.translateService.instant('AUTH.REGISTER.ERRORS.HANDLE_SPACES');
    if (control.hasError('displayNameEmpty')) return this.translateService.instant('AUTH.REGISTER.ERRORS.DISPLAY_NAME_EMPTY');
    if (control.hasError('handleTaken')) return this.translateService.instant('AUTH.REGISTER.ERRORS.HANDLE_TAKEN');
    if (control.hasError('minlength')) return this.translateService.instant('AUTH.REGISTER.ERRORS.MIN_LENGTH', { count: control.getError('minlength').requiredLength });
    if (control.hasError('maxlength')) return this.translateService.instant('AUTH.REGISTER.ERRORS.MAX_LENGTH', { count: control.getError('maxlength').requiredLength });
    if (control.hasError('lowercase')) return this.translateService.instant('AUTH.REGISTER.ERRORS.NEEDS_LOWERCASE');
    if (control.hasError('uppercase')) return this.translateService.instant('AUTH.REGISTER.ERRORS.NEEDS_UPPERCASE');
    if (control.hasError('specialChar')) return this.translateService.instant('AUTH.REGISTER.ERRORS.NEEDS_SPECIAL');
    if (field === 'confirmPassword' && control.hasError('passwordsMismatch')) return this.translateService.instant('AUTH.REGISTER.ERRORS.PASSWORDS_MISMATCH');

    return '';
  }

  async onRegister() {
    if (this.registerForm.invalid) {
      this.errorMessage = this.translateService.instant('AUTH.REGISTER.ERRORS.FILL_ALL_FIELDS');
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
        this.errorMessage = this.translateService.instant('AUTH.REGISTER.ERRORS.REGISTRATION_FAILED');
        console.error('Registration error:', err);
      }
    });
  }

  onLogin() {
    this.router.navigate(['/login']);
  }
}
