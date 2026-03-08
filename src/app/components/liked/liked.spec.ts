import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Liked } from './liked';

describe('Liked', () => {
  let component: Liked;
  let fixture: ComponentFixture<Liked>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Liked]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Liked);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
