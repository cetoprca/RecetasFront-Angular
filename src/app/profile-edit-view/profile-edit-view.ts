import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Theme, ThemeService } from '../services/theme.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { ImageService } from '../services/image.service';
import { UserDTO } from '../../model/user/user-dto';
import { environment } from '../../environments/environment';

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
  displayName: string = "";
  profilePicturePath: string = "";
  selectedProfilePicFile: File | null = null;
  profilePicPreview: string | null = null;
  saving: boolean = false;

  imageUrl = `${environment.apiUrl}/image/file/`;

  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private userService: UserService,
    private imageService: ImageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themeSubscription = this.themeService.currentTheme$.subscribe(
      (theme) => { this.currentTheme = theme; }
    );

    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.displayName = user.displayName;
        this.profilePicturePath = user.profilePicturePath;
      }
    });
  }

  ngOnDestroy() {
    if (this.themeSubscription) { this.themeSubscription.unsubscribe(); }
    if (this.authSubscription) { this.authSubscription.unsubscribe(); }
    if (this.profilePicPreview) { URL.revokeObjectURL(this.profilePicPreview); }
  }

  onProfilePicSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedProfilePicFile = input.files[0];
      if (this.profilePicPreview) { URL.revokeObjectURL(this.profilePicPreview); }
      this.profilePicPreview = URL.createObjectURL(this.selectedProfilePicFile);
    }
  }

  saveProfile() {
    if (this.saving) return;
    this.saving = true;

    const updateDisplayName = this.displayName !== this.currentUser?.displayName;
    const updateProfilePic = this.selectedProfilePicFile !== null;

    if (!updateDisplayName && !updateProfilePic) {
      this.saving = false;
      this.router.navigate(['/profile']);
      return;
    }

    const handleImageUpload = (): Promise<string | null> => {
      if (this.selectedProfilePicFile) {
        return new Promise((resolve, reject) => {
          this.imageService.uploadImage(this.selectedProfilePicFile!).subscribe({
            next: (image) => resolve(image.url),
            error: (err) => reject(err)
          });
        });
      }
      return Promise.resolve(null);
    };

    handleImageUpload().then(newProfilePicUrl => {
      const updatedUser = new UserDTO();
      updatedUser.id = this.currentUser!.id;
      updatedUser.displayName = this.displayName;
      updatedUser.biography = this.currentUser!.biography;
      updatedUser.profilePicturePath = newProfilePicUrl || this.profilePicturePath;
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
      console.error('Error uploading image:', err);
      this.saving = false;
    });
  }

  cancel() {
    this.router.navigate(['/profile']);
  }
}
