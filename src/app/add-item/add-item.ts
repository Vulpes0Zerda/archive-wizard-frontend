import { HttpErrorResponse } from '@angular/common/http';
import { Component, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { CloseSvg } from '../icons/close-svg/close-svg';
import { ShelfState } from '../services/state/shelf/shelf.state';
import { ItemActions } from '../services/state/item/item.actions';
import { Item } from '../services/model/Item';

@Component({
  imports: [CloseSvg, ReactiveFormsModule],
  selector: 'app-add-item',
  styleUrl: './add-item.scss',
  templateUrl: './add-item.html',
})
export class AddItem {
  protected readonly closed = output<void>();
  protected readonly submitting = signal(false);
  protected readonly submitError = signal<string | null>(null);
  protected readonly itemForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
  });

  constructor(private store: Store) {}

  protected submit(): void {
    if (this.itemForm.invalid || this.submitting()) {
      this.itemForm.markAllAsTouched();
      return;
    }

    const shelfId = this.store.selectSnapshot(ShelfState.getCurrentShelf)?.id;
    if (shelfId === undefined) {
      this.submitError.set('Select a shelf before adding an item.');
      return;
    }

    const request: Item.Request.postSingle = {
      name: this.itemForm.controls.name.value.trim(),
      shelfId,
    };
    if (!request.name) {
      this.itemForm.controls.name.setErrors({ required: true });
      return;
    }

    this.submitting.set(true);
    this.submitError.set(null);
    this.store.dispatch(new ItemActions.CreateItem(request)).subscribe({
      next: () => this.closed.emit(),
      error: (error: unknown) => {
        this.submitting.set(false);
        this.submitError.set(
          error instanceof HttpErrorResponse
            ? error.error?.message ?? error.message
            : 'Unable to create the item. Please try again.',
        );
      },
      complete: () => this.submitting.set(false),
    });
  }

  protected cancel(): void {
    this.closed.emit();
  }
}
