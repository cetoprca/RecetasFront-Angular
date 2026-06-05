import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Theme, ThemeService } from '../services/theme.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { ImageService } from '../services/image.service';
import { TranslateService } from '@ngx-translate/core';
import { UserDTO } from '../../model/user/user-dto';
import { environment } from '../../environments/environment';

interface ProfileEditForm {
  displayName: FormControl<string | null>;
}

export function profileEditFormValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value || '';
    return value.trim().length === 0 ? { displayNameEmpty: true } : null;
  };
}

@Component({
  selector: 'app-profile-edit-view',
  standalone: false,
  templateUrl: './profile-edit-view.html',
  styleUrl: './profile-edit-view.css',
})
export class ProfileEditView implements OnInit, OnDestroy {
  currentTheme!: Theme;
  private themeSubscription!: Subscription;
  private authSubscription!: Subscription;

  currentUser: UserDTO | null = null;
  profilePicturePath: string = "";
  bannerPath: string = "";
  selectedProfilePicFile: File | null = null;
  selectedBannerFile: File | null = null;
  profilePicPreview: string | null = null;
  bannerPreview: string | null = null;
  saving: boolean = false;

  imageUrl = `${environment.apiUrl}/image/file/`;

  profileForm = new FormGroup<ProfileEditForm>({
    displayName: new FormControl('', [Validators.required, profileEditFormValidator()]),
  });

  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private userService: UserService,
    private imageService: ImageService,
    private router: Router,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themeSubscription = this.themeService.currentTheme$.subscribe(
      (theme) => { this.currentTheme = theme; }
    );

    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.profileForm.patchValue({ displayName: user.displayName });
        this.profilePicturePath = user.profilePicturePath;
        this.bannerPath = user.bannerPath || "";
      }
    });
  }

  ngOnDestroy() {
    if (this.themeSubscription) { this.themeSubscription.unsubscribe(); }
    if (this.authSubscription) { this.authSubscription.unsubscribe(); }
    if (this.profilePicPreview) { URL.revokeObjectURL(this.profilePicPreview); }
    if (this.bannerPreview) { URL.revokeObjectURL(this.bannerPreview); }
  }

  onProfilePicSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedProfilePicFile = input.files[0];
      if (this.profilePicPreview) { URL.revokeObjectURL(this.profilePicPreview); }
      this.profilePicPreview = URL.createObjectURL(this.selectedProfilePicFile);
    }
  }

  onBannerSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedBannerFile = input.files[0];
      if (this.bannerPreview) { URL.revokeObjectURL(this.bannerPreview); }
      this.bannerPreview = URL.createObjectURL(this.selectedBannerFile);
    }
  }

  getErrorMessage(): string {
    const control = this.profileForm.get('displayName');
    if (!control || !control.errors || !control.touched) return '';
    if (control.hasError('required')) return this.translateService.instant('PROFILE.ERRORS.REQUIRED');
    if (control.hasError('displayNameEmpty')) return this.translateService.instant('PROFILE.ERRORS.EMPTY');
    return '';
  }

  saveProfile() {
    if (this.saving || this.profileForm.invalid) return;
    this.saving = true;

    const displayName = this.profileForm.get('displayName')?.value ?? '';
    const updateDisplayName = displayName !== this.currentUser?.displayName;
    const updateProfilePic = this.selectedProfilePicFile !== null;
    const updateBanner = this.selectedBannerFile !== null;

    if (!updateDisplayName && !updateProfilePic && !updateBanner) {
      this.saving = false;
      this.router.navigate(['/profile']);
      return;
    }

    const uploadFile = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        this.imageService.uploadImage(file).subscribe({
          next: (image) => resolve(image.url),
          error: (err) => reject(err)
        });
      });
    };

    const tasks: Promise<void>[] = [];
    let newProfilePicUrl: string | null = null;
    let newBannerUrl: string | null = null;

    if (this.selectedProfilePicFile) {
      tasks.push(
        uploadFile(this.selectedProfilePicFile).then(url => { newProfilePicUrl = url; })
      );
    }
    if (this.selectedBannerFile) {
      tasks.push(
        uploadFile(this.selectedBannerFile).then(url => { newBannerUrl = url; })
      );
    }

    Promise.all(tasks).then(() => {
      const updatedUser = new UserDTO();
      updatedUser.id = this.currentUser!.id;
      updatedUser.displayName = displayName;
      updatedUser.biography = this.currentUser!.biography;
      updatedUser.profilePicturePath = newProfilePicUrl || this.profilePicturePath;
      updatedUser.bannerPath = newBannerUrl || this.bannerPath;
      updatedUser.following = this.currentUser!.following;
      updatedUser.followers = this.currentUser!.followers;

      this.userService.updateUser(updatedUser).subscribe({
        next: (response) => {
          this.authService.currentUser$.next(response);
          this.saving = false;
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          console.error('Error updating profile:', err);
          this.saving = false;
        }
      });
    }).catch(err => {
      console.error('Error uploading images:', err);
      this.saving = false;
    });
  }

  cancel() {
    this.router.navigate(['/profile']);
  }
}
