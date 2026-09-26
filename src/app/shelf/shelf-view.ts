import { Component, computed, effect, OnInit, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { ItemActions } from '../services/state/item/item.actions';
import { Shelf } from '../services/model/Shelf';
import { ShelfState } from '../services/state/shelf/shelf.state';
import { ApiCallStatus } from '../services/state/ApiCallStatus';
import { Item } from '../services/model/Item';
import { ItemState } from '../services/state/item/item.state';
import { CategoryValue } from '../services/model/CategoryValue';

@Component({
  imports: [],
  selector: 'app-shelf-view',
  styleUrl: './shelf-view.scss',
  templateUrl: './shelf-view.html',
})
export class ShelfView implements OnInit {
  protected currentShelf: Signal<Shelf.Model | undefined>;
  protected shelfStatus: Signal<ApiCallStatus>;
  protected itemList: Signal<Array<Item.Model>>;
  protected currentShelfItems: Signal<Array<Item.Model>>;

  constructor(protected store: Store) {
    this.currentShelf = store.selectSignal(ShelfState.getCurrentShelf);
    this.shelfStatus = store.selectSignal(ShelfState.getStatus);
    this.itemList = store.selectSignal(ItemState.getAllItems);
    this.currentShelfItems = computed(() =>
      this.itemList().filter((item) => item.shelfId === this.currentShelf()?.id),
    );
  }

  ngOnInit(): void {
    //TODO: Check the router for the path data to fetch the relevant data in case the user starts at this path
  }

  protected createItem(newItem: Item.Request.postSingle): void {
    this.store.dispatch(new ItemActions.CreateItem(newItem));
  }
}
