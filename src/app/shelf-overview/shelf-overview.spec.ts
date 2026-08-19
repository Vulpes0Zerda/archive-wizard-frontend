import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelfOverview } from './shelf-overview';

describe('ShelfOverview', () => {
  let component: ShelfOverview;
  let fixture: ComponentFixture<ShelfOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShelfOverview],
    }).compileComponents();

    fixture = TestBed.createComponent(ShelfOverview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
