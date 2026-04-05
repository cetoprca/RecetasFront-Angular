import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedView } from './saved-view';

describe('SavedView', () => {
  let component: SavedView;
  let fixture: ComponentFixture<SavedView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SavedView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
