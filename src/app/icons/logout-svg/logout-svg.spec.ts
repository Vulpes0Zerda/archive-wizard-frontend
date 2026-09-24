import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogoutSvg } from './logout-svg';

describe('LogoutSvg', () => {
  let component: LogoutSvg;
  let fixture: ComponentFixture<LogoutSvg>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoutSvg],
    }).compileComponents();

    fixture = TestBed.createComponent(LogoutSvg);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
