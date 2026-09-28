import { Component, computed, effect, OnDestroy, output, Signal } from '@angular/core';
import { CategoryKey } from '../services/model/CategoryKey';
import { ItemState } from '../services/state/item/item.state';
import { Store } from '@ngxs/store';
import { Shelf } from '../services/model/Shelf';
import { Item } from '../services/model/Item';
import { CategoryKeyState } from '../services/state/categoryKey/category-key.state';
import { ShelfState } from '../services/state/shelf/shelf.state';
import { CategoryValue } from '../services/model/CategoryValue';
import { CategoryValueState } from '../services/state/categoryValue/category-value.state';
import { CategoryKeyActions } from '../services/state/categoryKey/category-key.actions';
import { CategoryValueActions } from '../services/state/categoryValue/category-value.actions';

@Component({
  imports: [],
  selector: 'app-item-view',
  styleUrl: './item-view.scss',
  templateUrl: './item-view.html',
})
export class ItemView implements OnDestroy {
  protected readonly closed = output<void>();
  protected keyList: Signal<Array<CategoryKey.Model>>;
  protected currentItem: Signal<Item.Model | undefined>;
  protected shelfList: Signal<Array<Shelf.Model>>;
  protected allKeysInItem: Signal<Array<CategoryKey.Model>>;
  protected categoryValues: Signal<Array<CategoryValue.State>>;
  private dirtyItemId: number | null = null;
  private requestedCategoryGroupId: number | undefined;

  constructor(protected store: Store) {
    this.currentItem = store.selectSignal<Item.Model | undefined>(ItemState.getCurrentItem);
    this.keyList = store.selectSignal<Array<CategoryKey.Model>>(
      CategoryKeyState.getAllCategoryKeys,
    );
    this.shelfList = store.selectSignal<Array<Shelf.Model>>(ShelfState.getAllShelfs);
    this.categoryValues = store.selectSignal<Array<CategoryValue.State>>(
      CategoryValueState.getAllCategoryValues,
    );
    const currentShelf = computed(() =>
      this.shelfList().find((shelf) => shelf.id === this.currentItem()?.shelfId),
    );
    this.allKeysInItem = computed(() => {
      const categoryGroupId = currentShelf()?.categoryGroupId;
      return this.keyList().filter(
        (categoryKey) => categoryKey.categoryGroup.id === categoryGroupId,
      );
    });

    effect(() => {
      const categoryGroupId = currentShelf()?.categoryGroupId;
      if (categoryGroupId !== undefined && categoryGroupId !== this.requestedCategoryGroupId) {
        this.requestedCategoryGroupId = categoryGroupId;
        this.store.dispatch(new CategoryKeyActions.FetchAll(categoryGroupId));
      }
    });

  }

  protected getValue(categoryKeyId: number): string {
    const itemId = this.currentItem()?.id;
    if (itemId === undefined) {
      return '';
    }

    return (
      this.categoryValues().find(
        (value) => value.itemId === itemId && value.categoryKeyId === categoryKeyId,
      )?.value ?? ''
    );
  }

  protected updateValue(categoryKeyId: number, event: Event): void {
    const itemId = this.currentItem()?.id;
    if (itemId === undefined) {
      return;
    }

    if (this.dirtyItemId !== null && this.dirtyItemId !== itemId) {
      this.saveValues(this.dirtyItemId);
    }

    this.dirtyItemId = itemId;
    this.store.dispatch(
      new CategoryValueActions.SetLocalValue(
        itemId,
        categoryKeyId,
        (event.target as HTMLInputElement).value,
      ),
    );
  }

  protected saveOnEnter(event: KeyboardEvent): void {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    const itemId = this.currentItem()?.id;
    if (itemId !== undefined) {
      this.saveValues(itemId);
    }
  }

  ngOnDestroy(): void {
    if (this.dirtyItemId !== null) {
      this.saveValues(this.dirtyItemId);
    }
  }

  private saveValues(itemId: number): void {
    this.store.dispatch(new CategoryValueActions.UpdateValues(itemId));
    if (this.dirtyItemId === itemId) {
      this.dirtyItemId = null;
    }
  }
}
