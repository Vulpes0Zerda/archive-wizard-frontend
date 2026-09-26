import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShelfView } from './shelf-view';
import { provideStore } from '@ngxs/store';
import { ShelfState } from '../services/state/shelf/shelf.state';
import { ApiService } from '../services/api/api.service';

describe('ShelfView', () => {
  let component: ShelfView;
  let fixture: ComponentFixture<ShelfView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShelfView],
      providers: [provideStore([ShelfState]), { provide: ApiService, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(ShelfView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
