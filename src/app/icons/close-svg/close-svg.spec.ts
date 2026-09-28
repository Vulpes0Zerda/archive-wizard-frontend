import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CloseSvg } from './close-svg';

describe('CloseSvg', () => {
  let component: CloseSvg;
  let fixture: ComponentFixture<CloseSvg>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloseSvg],
    }).compileComponents();

    fixture = TestBed.createComponent(CloseSvg);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
