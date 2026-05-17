import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Theme, ThemeService } from '../services/theme.service';
import { AuthService } from '../services/auth.service';
import { RecipeService } from '../services/recipe.service';
import { TagService } from '../services/tag.service';
import { IngredientService } from '../services/ingredient.service';
import { ImageService } from '../services/image.service';
import { StepService } from '../services/step.service';
import { RecipeDTO } from '../../model/recipe/recipe-dto';
import { CuisineDTO } from '../../model/cuisine/cuisine-dto';
import { TagDTO } from '../../model/tag/tag-dto';
import { IngredientDTO } from '../../model/ingredient/ingredient-dto';
import { StepDTO } from '../../model/step/step-dto';
import { RecipeFormData } from '../services/recipe-form.resolver';
import { environment } from '../../environments/environment';

interface StepForm {
  title: string;
  description: string;
  imageFile: File | null;
  imagePreview: string | null;
}

@Component({
  selector: 'app-recipe-add-view',
  standalone: false,
  templateUrl: './recipe-add-view.html',
  styleUrl: './recipe-add-view.css',
})
export class RecipeAddView implements OnInit, OnDestroy {
  currentTheme!: Theme;
  private themeSubscription!: Subscription;

  title: string = "";
  description: string = "";
  prepTime: number = 0;
  cookTime: number = 0;
  isPublic: boolean = true;

  get totalTime(): number {
    return this.prepTime + this.cookTime;
  }

  imageFile: File | null = null;
  imagePreview: string | null = null;

  cuisines: CuisineDTO[] = [];
  selectedCuisine: CuisineDTO | null = null;

  allTags: TagDTO[] = [];
  selectedTags: TagDTO[] = [];
  newTagName: string = "";

  allIngredients: IngredientDTO[] = [];
  selectedIngredients: IngredientDTO[] = [];
  newIngredientName: string = "";

  steps: StepForm[] = [{ title: "", description: "", imageFile: null, imagePreview: null }];
  saving: boolean = false;

  imageUrl = `${environment.apiUrl}/image/file/`;

  constructor(
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private authService: AuthService,
    private recipeService: RecipeService,
    private tagService: TagService,
    private ingredientService: IngredientService,
    private imageService: ImageService,
    private stepService: StepService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themeSubscription = this.themeService.currentTheme$.subscribe(
      (theme) => { this.currentTheme = theme; }
    );

    const data = this.route.snapshot.data['formData'] as RecipeFormData;
    this.cuisines = data.cuisines;
    this.allTags = data.tags;
    this.allIngredients = data.ingredients;
  }

  ngOnDestroy() {
    if (this.themeSubscription) { this.themeSubscription.unsubscribe(); }
    if (this.imagePreview) { URL.revokeObjectURL(this.imagePreview); }
    this.steps.forEach(s => { if (s.imagePreview) URL.revokeObjectURL(s.imagePreview); });
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
      if (this.imagePreview) { URL.revokeObjectURL(this.imagePreview); }
      this.imagePreview = URL.createObjectURL(this.imageFile);
    }
  }

  onStepImageSelected(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const step = this.steps[index];
      if (step.imagePreview) { URL.revokeObjectURL(step.imagePreview); }
      step.imageFile = input.files[0];
      step.imagePreview = URL.createObjectURL(step.imageFile);
    }
  }

  removeStepImage(index: number) {
    const step = this.steps[index];
    if (step.imagePreview) { URL.revokeObjectURL(step.imagePreview); }
    step.imageFile = null;
    step.imagePreview = null;
  }

  addStep() {
    this.steps.push({ title: "", description: "", imageFile: null, imagePreview: null });
  }

  removeStep(index: number) {
    const step = this.steps[index];
    if (step.imagePreview) { URL.revokeObjectURL(step.imagePreview); }
    this.steps.splice(index, 1);
  }

  addTag(tag: TagDTO) {
    if (!this.selectedTags.includes(tag)) {
      this.selectedTags.push(tag);
    }
  }

  removeTag(tag: TagDTO) {
    const idx = this.selectedTags.indexOf(tag);
    if (idx >= 0) {
      this.selectedTags.splice(idx, 1);
    }
  }

  addNewTag() {
    const name = this.newTagName.trim();
    if (!name) return;
    const tagDto = new TagDTO();
    tagDto.name = name;
    this.tagService.createTag(tagDto).subscribe({
      next: (tag) => {
        this.allTags.push(tag);
        this.selectedTags.push(tag);
        this.newTagName = "";
      },
      error: (err) => console.error('Error creating tag:', err)
    });
  }

  addIngredient(ingredient: IngredientDTO) {
    if (!this.selectedIngredients.includes(ingredient)) {
      this.selectedIngredients.push(ingredient);
    }
  }

  removeIngredient(ingredient: IngredientDTO) {
    const idx = this.selectedIngredients.indexOf(ingredient);
    if (idx >= 0) {
      this.selectedIngredients.splice(idx, 1);
    }
  }

  addNewIngredient() {
    const name = this.newIngredientName.trim();
    if (!name) return;
    this.ingredientService.createIngredient(new IngredientDTO(0, name, [])).subscribe({
      next: (ingredient) => {
        this.allIngredients.push(ingredient);
        this.selectedIngredients.push(ingredient);
        this.newIngredientName = "";
      },
      error: (err) => console.error('Error creating ingredient:', err)
    });
  }

  save() {
    if (this.saving) return;
    this.saving = true;

    const uploadFile = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        this.imageService.uploadImage(file).subscribe({
          next: (image) => resolve(image.url),
          error: (err) => reject(err)
        });
      });
    };

    const uploadTasks: Promise<void>[] = [];
    let imageUrl: string | null = null;
    const stepImageUrls: (string | null)[] = [];

    if (this.imageFile) {
      uploadTasks.push(
        uploadFile(this.imageFile).then(url => { imageUrl = url; })
      );
    }

    this.steps.forEach((step, i) => {
      stepImageUrls[i] = null;
      if (step.imageFile) {
        uploadTasks.push(
          uploadFile(step.imageFile).then(url => { stepImageUrls[i] = url; })
        );
      }
    });

    Promise.all(uploadTasks).then(() => {
      const recipeDTO = new RecipeDTO();
      recipeDTO.title = this.title;
      recipeDTO.description = this.description;
      recipeDTO.image = imageUrl || "";
      recipeDTO.prepTime = this.prepTime;
      recipeDTO.cookTime = this.cookTime;
      recipeDTO.totalTime = this.totalTime;
      recipeDTO.isPublic = this.isPublic;
      recipeDTO.cuisine = this.selectedCuisine?.id || 0;
      recipeDTO.tags = this.selectedTags.map(t => t.id);
      recipeDTO.ingredients = this.selectedIngredients.map(i => i.id);
      recipeDTO.steps = [];
      recipeDTO.author = this.authService.currentUser$.value?.id || "";
      (recipeDTO as any).creationDate = undefined;

      this.recipeService.saveRecipe(recipeDTO).subscribe({
        next: (savedRecipe) => {
          const newId = savedRecipe.id;
          const stepTasks: Promise<void>[] = [];

          this.steps.forEach((step, i) => {
            const stepDTO = new StepDTO(
              0,
              step.title,
              step.description,
              i + 1,
              stepImageUrls[i] || "",
              newId
            );
            stepTasks.push(
              new Promise((resolve, reject) => {
                this.stepService.saveStep(newId, stepDTO).subscribe({
                  next: () => resolve(),
                  error: (err) => reject(err)
                });
              })
            );
          });

          Promise.all(stepTasks).then(() => {
            this.saving = false;
            this.router.navigate(['/recipe', newId]);
          }).catch(err => {
            console.error('Error saving steps:', err);
            this.saving = false;
          });
        },
        error: (err) => {
          console.error('Error saving recipe:', err);
          this.saving = false;
        }
      });
    }).catch(err => {
      console.error('Error uploading images:', err);
      this.saving = false;
    });
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
