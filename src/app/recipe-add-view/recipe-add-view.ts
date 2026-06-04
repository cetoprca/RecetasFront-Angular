import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
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
import { CuisineService } from '../services/cuisine.service';
import { environment } from '../../environments/environment';

interface StepForm {
  title: string;
  description: string;
  imageFile: File | null;
  imagePreview: string | null;
}

interface RecipeForm {
  title: FormControl<string | null>;
  description: FormControl<string | null>;
  prepTime: FormControl<number | null>;
  cookTime: FormControl<number | null>;
  isPublic: FormControl<boolean | null>;
  cuisine: FormControl<number | null>;
  tags: FormControl<number[] | null>;
  ingredients: FormControl<number[] | null>;
  steps: FormArray<FormGroup<StepFormGroup>>;
}

interface StepFormGroup {
  title: FormControl<string | null>;
  description: FormControl<string | null>;
}

export function recipeFormValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const title = (group.get('title')?.value || '').toString().trim();
    const description = (group.get('description')?.value || '').toString().trim();
    const prepTime = group.get('prepTime')?.value;
    const cookTime = group.get('cookTime')?.value;
    const cuisine = group.get('cuisine')?.value;
    const tags = group.get('tags')?.value;
    const ingredients = group.get('ingredients')?.value;
    const steps = group.get('steps') as FormArray;

    const errors: ValidationErrors = {};
    if (!title) errors['titleEmpty'] = true;
    if (!description) errors['descriptionEmpty'] = true;
    if (prepTime === null || prepTime === undefined) errors['prepTimeEmpty'] = true;
    if (cookTime === null || cookTime === undefined) errors['cookTimeEmpty'] = true;
    if (!cuisine) errors['cuisineEmpty'] = true;
    if (!tags || !Array.isArray(tags) || tags.length === 0) errors['tagsEmpty'] = true;
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) errors['ingredientsEmpty'] = true;
    if (steps.length === 0) errors['stepsEmpty'] = true;
    return Object.keys(errors).length > 0 ? errors : null;
  };
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

  get totalTime(): number {
    return (this.recipeForm.get('prepTime')?.value ?? 0) + (this.recipeForm.get('cookTime')?.value ?? 0);
  }

  imageFile: File | null = null;
  imagePreview: string | null = null;

  cuisines: CuisineDTO[] = [];
  selectedCuisine: CuisineDTO | null = null;
  showCuisineDropdown: boolean = false;
  cuisineSearchText: string = "";

  get filteredCuisines(): CuisineDTO[] {
    const q = this.cuisineSearchText.toLowerCase().trim();
    return q ? this.cuisines.filter(c => c.name.toLowerCase().includes(q)) : this.cuisines;
  }

  allTags: TagDTO[] = [];
  selectedTags: TagDTO[] = [];
  newTagName: string = "";
  showTagDropdown: boolean = false;
  tagSearchText: string = "";

  get filteredTags(): TagDTO[] {
    const q = this.tagSearchText.toLowerCase().trim();
    let list = this.allTags.filter(t => !this.selectedTags.includes(t));
    return q ? list.filter(t => t.name.toLowerCase().includes(q)) : list;
  }

  allIngredients: IngredientDTO[] = [];
  selectedIngredients: IngredientDTO[] = [];
  newIngredientName: string = "";
  showIngredientDropdown: boolean = false;
  ingredientSearchText: string = "";
  newCuisineName: string = "";

  get filteredIngredients(): IngredientDTO[] {
    const q = this.ingredientSearchText.toLowerCase().trim();
    let list = this.allIngredients.filter(i => !this.selectedIngredients.includes(i));
    return q ? list.filter(i => i.name.toLowerCase().includes(q)) : list;
  }

  steps: StepForm[] = [{ title: "", description: "", imageFile: null, imagePreview: null }];
  saving: boolean = false;
  submitted: boolean = false;

  recipeForm = new FormGroup<RecipeForm>({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    prepTime: new FormControl(0, [Validators.required, Validators.min(0)]),
    cookTime: new FormControl(0, [Validators.required, Validators.min(0)]),
    isPublic: new FormControl(true),
    cuisine: new FormControl<number | null>(null),
    tags: new FormControl<number[] | null>([]),
    ingredients: new FormControl<number[] | null>([]),
    steps: new FormArray<FormGroup<StepFormGroup>>([this.createStepGroup()]),
  }, { validators: recipeFormValidator() });

  get stepsFormArray(): FormArray<FormGroup<StepFormGroup>> {
    return this.recipeForm.get('steps') as FormArray<FormGroup<StepFormGroup>>;
  }

  createStepGroup(): FormGroup<StepFormGroup> {
    return new FormGroup<StepFormGroup>({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });
  }

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
    private cuisineService: CuisineService,
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
    this.stepsFormArray.push(this.createStepGroup());
    this.steps.push({ title: "", description: "", imageFile: null, imagePreview: null });
    this.recipeForm.get('steps')?.markAsTouched();
  }

  onlyDigits(event: KeyboardEvent) {
    if (!/^[0-9]$/.test(event.key) && !event.ctrlKey && !event.altKey && !event.metaKey) {
      const allowed = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
      if (!allowed.includes(event.key)) {
        event.preventDefault();
      }
    }
  }

  removeStep(index: number) {
    const step = this.steps[index];
    if (step.imagePreview) { URL.revokeObjectURL(step.imagePreview); }
    this.steps.splice(index, 1);
    this.stepsFormArray.removeAt(index);
    this.recipeForm.get('steps')?.markAsTouched();
  }

  getErrorMessage(field: string, stepIndex?: number): string {
    if (stepIndex !== undefined) {
      const stepGroup = this.stepsFormArray.at(stepIndex);
      const control = stepGroup.get(field);
      if (!control || !control.touched) return '';
      if (control.hasError('required')) return `Step ${stepIndex + 1} ${field === 'title' ? 'title' : 'description'} is required`;
      return '';
    }

    const control = this.recipeForm.get(field);

    if (control && control.touched) {
      if (control.hasError('required')) {
        const labels: Record<string, string> = { title: 'Title', description: 'Description', prepTime: 'Preparation time', cookTime: 'Cook time' };
        return `${labels[field] || field} is required`;
      }
      if (control.hasError('min')) return 'Value must be 0 or greater';
    }

    if (this.submitted) {
      if (this.recipeForm.hasError('cuisineEmpty') && field === 'cuisine') return 'Please select a cuisine';
      if (this.recipeForm.hasError('tagsEmpty') && field === 'tags') return 'Please add at least one tag';
      if (this.recipeForm.hasError('ingredientsEmpty') && field === 'ingredients') return 'Please add at least one ingredient';
      if (this.recipeForm.hasError('stepsEmpty') && field === 'steps') return 'Please add at least one step';
    }
    return '';
  }

  @HostListener('document:click')
  closeAllDropdowns() {
    this.showCuisineDropdown = false;
    this.showTagDropdown = false;
    this.showIngredientDropdown = false;
  }

  toggleCuisineDropdown() {
    this.showCuisineDropdown = !this.showCuisineDropdown;
    this.showTagDropdown = false;
    this.showIngredientDropdown = false;
    this.cuisineSearchText = "";
  }

  selectCuisine(cuisine: CuisineDTO) {
    this.selectedCuisine = cuisine;
    this.recipeForm.get('cuisine')?.setValue(cuisine.id);
    this.recipeForm.get('cuisine')?.markAsTouched();
    this.showCuisineDropdown = false;
  }

  addTag(tag: TagDTO) {
    if (!this.selectedTags.includes(tag)) {
      this.selectedTags.push(tag);
    }
    this.recipeForm.get('tags')?.setValue(this.selectedTags.map(t => t.id));
    this.recipeForm.get('tags')?.markAsTouched();
    this.showTagDropdown = false;
  }

  removeTag(tag: TagDTO) {
    const idx = this.selectedTags.indexOf(tag);
    if (idx >= 0) {
      this.selectedTags.splice(idx, 1);
    }
    this.recipeForm.get('tags')?.setValue(this.selectedTags.map(t => t.id));
    this.recipeForm.get('tags')?.markAsTouched();
  }

  toggleTagDropdown() {
    this.showTagDropdown = !this.showTagDropdown;
    this.showCuisineDropdown = false;
    this.showIngredientDropdown = false;
    this.tagSearchText = "";
  }

  addNewTag() {
    const name = this.newTagName.trim();
    if (!name) return;
    const tagDto = new TagDTO();
    tagDto.name = name;
    (tagDto as any).id = undefined;
    this.tagService.createTag(tagDto).subscribe({
      next: (tag) => {
        this.allTags.push(tag);
        this.selectedTags.push(tag);
        this.newTagName = "";
        this.recipeForm.get('tags')?.setValue(this.selectedTags.map(t => t.id));
        this.recipeForm.get('tags')?.markAsTouched();
      },
      error: (err) => console.error('Error creating tag:', err)
    });
  }

  addIngredient(ingredient: IngredientDTO) {
    if (!this.selectedIngredients.includes(ingredient)) {
      this.selectedIngredients.push(ingredient);
    }
    this.recipeForm.get('ingredients')?.setValue(this.selectedIngredients.map(i => i.id));
    this.recipeForm.get('ingredients')?.markAsTouched();
    this.showIngredientDropdown = false;
  }

  removeIngredient(ingredient: IngredientDTO) {
    const idx = this.selectedIngredients.indexOf(ingredient);
    if (idx >= 0) {
      this.selectedIngredients.splice(idx, 1);
    }
    this.recipeForm.get('ingredients')?.setValue(this.selectedIngredients.map(i => i.id));
    this.recipeForm.get('ingredients')?.markAsTouched();
  }

  toggleIngredientDropdown() {
    this.showIngredientDropdown = !this.showIngredientDropdown;
    this.showCuisineDropdown = false;
    this.showTagDropdown = false;
    this.ingredientSearchText = "";
  }

  addNewIngredient() {
    const name = this.newIngredientName.trim();
    if (!name) return;
    const dto = new IngredientDTO(0, name, []);
    (dto as any).id = undefined;
    this.ingredientService.createIngredient(dto).subscribe({
      next: (ingredient) => {
        this.allIngredients.push(ingredient);
        this.selectedIngredients.push(ingredient);
        this.newIngredientName = "";
        this.recipeForm.get('ingredients')?.setValue(this.selectedIngredients.map(i => i.id));
        this.recipeForm.get('ingredients')?.markAsTouched();
      },
      error: (err) => console.error('Error creating ingredient:', err)
    });
  }

  addNewCuisine() {
    const name = this.newCuisineName.trim();
    if (!name) return;
    const dto = new CuisineDTO(0, name, []);
    (dto as any).id = undefined;
    this.cuisineService.createCuisine(dto).subscribe({
      next: (cuisine) => {
        this.cuisines.push(cuisine);
        this.selectedCuisine = cuisine;
        this.recipeForm.get('cuisine')?.setValue(cuisine.id);
        this.recipeForm.get('cuisine')?.markAsTouched();
        this.newCuisineName = "";
        this.showCuisineDropdown = false;
      },
      error: (err) => console.error('Error creating cuisine:', err)
    });
  }

  save() {
    if (this.saving) return;
    this.submitted = true;
    this.recipeForm.markAllAsTouched();
    if (this.recipeForm.invalid) return;
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
      const formValue = this.recipeForm.value;
      const recipeDTO = new RecipeDTO();
      recipeDTO.title = formValue.title || '';
      recipeDTO.description = formValue.description || '';
      recipeDTO.image = imageUrl || "";
      recipeDTO.prepTime = formValue.prepTime || 0;
      recipeDTO.cookTime = formValue.cookTime || 0;
      recipeDTO.totalTime = this.totalTime;
      recipeDTO.isPublic = formValue.isPublic ?? true;
      recipeDTO.cuisine = this.selectedCuisine?.id || 0;
      recipeDTO.tags = this.selectedTags.map(t => t.id);
      recipeDTO.ingredients = this.selectedIngredients.map(i => i.id);
      recipeDTO.steps = [];
      recipeDTO.author = this.authService.currentUser$.value?.id || "";
      (recipeDTO as any).creationDate = undefined;
      (recipeDTO as any).id = undefined;

      this.recipeService.saveRecipe(recipeDTO).subscribe({
        next: (savedRecipe) => {
          const newId = savedRecipe.id;
          const stepTasks: Promise<void>[] = [];

          this.stepsFormArray.controls.forEach((stepGroup, i) => {
            const stepDTO = new StepDTO(
              stepGroup.value.title || '',
              stepGroup.value.description || '',
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
