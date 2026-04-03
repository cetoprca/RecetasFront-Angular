import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftSideMenu } from './left-side-menu';

describe('LeftSideMenu', () => {
  let component: LeftSideMenu;
  let fixture: ComponentFixture<LeftSideMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeftSideMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeftSideMenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
