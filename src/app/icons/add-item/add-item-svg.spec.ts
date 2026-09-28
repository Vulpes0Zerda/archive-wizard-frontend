import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddItemSvg } from './add-item';

describe('AddItemSvg', () => {
  let component: AddItemSvg;
  let fixture: ComponentFixture<AddItemSvg>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddItemSvg],
    }).compileComponents();

    fixture = TestBed.createComponent(AddItemSvg);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
