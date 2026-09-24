import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { ItemAction } from './item.actions';

export interface ItemStateModel {
  items: string[];
}

@State<ItemStateModel>({
  name: 'item',
  defaults: {
    items: [],
  },
})
@Injectable()
export class ItemState {
  @Selector()
  static getState(state: ItemStateModel) {
    return state;
  }

  @Action(ItemAction)
  add(ctx: StateContext<ItemStateModel>, { payload }: ItemAction) {
    const stateModel = ctx.getState();
    stateModel.items = [...stateModel.items, payload];
    ctx.setState(stateModel);
  }
}
