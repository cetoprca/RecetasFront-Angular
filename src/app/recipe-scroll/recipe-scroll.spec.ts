import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeScroll } from './recipe-scroll';

describe('RecipeScroll', () => {
  let component: RecipeScroll;
  let fixture: ComponentFixture<RecipeScroll>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecipeScroll]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeScroll);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
