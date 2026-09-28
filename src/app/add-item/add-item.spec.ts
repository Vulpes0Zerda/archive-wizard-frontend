import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ItemActions } from '../services/state/item/item.actions';
import { AddItem } from './add-item';

describe('AddItem', () => {
  let fixture: ComponentFixture<AddItem>;
  let dispatchSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    const storeMock = {
      selectSnapshot: vi.fn(() => ({ id: 12 })),
      dispatch: vi.fn().mockReturnValue(of(undefined)),
    };
    dispatchSpy = storeMock.dispatch;

    await TestBed.configureTestingModule({
      imports: [AddItem],
      providers: [{ provide: Store, useValue: storeMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(AddItem);
    fixture.detectChanges();
  });

  it('submits the item name and current shelf ID', () => {
    fixture.componentInstance['itemForm'].controls.name.setValue('  My item  ');
    fixture.nativeElement.querySelector('form').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );

    expect(dispatchSpy).toHaveBeenCalledWith(
      new ItemActions.CreateItem({ name: 'My item', shelfId: 12 }),
    );
  });

  it('closes without dispatching when cancelled', () => {
    const closedSpy = vi.fn();
    fixture.componentInstance['closed'].subscribe(closedSpy);

    fixture.nativeElement.querySelector('button[type="button"]').click();

    expect(closedSpy).toHaveBeenCalledOnce();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});
