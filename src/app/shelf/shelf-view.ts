import { Component, computed, Signal, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs';
import { Store } from '@ngxs/store';
import { ItemActions } from '../services/state/item/item.actions';
import { Shelf } from '../services/model/Shelf';
import { ShelfState } from '../services/state/shelf/shelf.state';
import { ApiCallStatus } from '../services/state/ApiCallStatus';
import { Item } from '../services/model/Item';
import { ItemState } from '../services/state/item/item.state';
import { ShelfActions } from '../services/state/shelf/shelf.actions';
import { AddItem } from '../add-item/add-item';
import { ItemView } from '../item/item-view';

@Component({
  imports: [AddItem, ItemView],
  selector: 'app-shelf-view',
  styleUrl: './shelf-view.scss',
  templateUrl: './shelf-view.html',
})
export class ShelfView {
  protected currentShelf: Signal<Shelf.Model | undefined>;
  protected shelfStatus: Signal<ApiCallStatus>;
  protected itemList: Signal<Array<Item.Model>>;
  protected currentShelfItems: Signal<Array<Item.Model>>;
  protected sidebarMode = signal<'item' | 'new-item' | null>(null);

  constructor(
    protected store: Store,
    route: ActivatedRoute,
  ) {
    this.currentShelf = store.selectSignal(ShelfState.getCurrentShelf);
    this.shelfStatus = store.selectSignal(ShelfState.getStatus);
    this.itemList = store.selectSignal(ItemState.getAllItems);
    this.currentShelfItems = computed(() =>
      this.itemList().filter((item) => item.shelfId === this.currentShelf()?.id),
    );

    route.paramMap
      .pipe(
        map((params) => Number(params.get('shelfId'))),
        filter((shelfId) => Number.isInteger(shelfId) && shelfId > 0),
        distinctUntilChanged(),
        switchMap((shelfId) => {
          this.sidebarMode.set(null);
          return store.dispatch(new ShelfActions.SetCurrent(shelfId));
        }),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  protected selectItem(itemId: number): void {
    this.store.dispatch(new ItemActions.SetCurrent(itemId)).subscribe({
      next: () => this.sidebarMode.set('item'),
    });
  }

  protected showAddItem(): void {
    this.sidebarMode.set('new-item');
  }

  protected closeSidebar(): void {
    this.sidebarMode.set(null);
  }

  protected createItem(newItem: Item.Request.postSingle): void {
    this.store.dispatch(new ItemActions.CreateItem(newItem));
  }
}
