export class ItemAction {
  static readonly type = '[Item] Add item';
  constructor(readonly payload: string) {}
}
