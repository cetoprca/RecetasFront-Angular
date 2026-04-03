import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightSideMenu } from './right-side-menu';

describe('RightSideMenu', () => {
  let component: RightSideMenu;
  let fixture: ComponentFixture<RightSideMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RightSideMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RightSideMenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
