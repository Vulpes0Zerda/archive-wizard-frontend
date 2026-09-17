import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api/api.service';
import { Shelf } from '../services/model/Shelf';

@Component({
  selector: 'app-shelf-overview',
  imports: [RouterLink],
  templateUrl: './shelf-overview.html',
  styleUrl: './shelf-overview.scss',
})
export class ShelfOverview implements OnInit {
  protected shelfs: WritableSignal<Shelf.Response.PostSingle> = signal(new Array());

  public constructor() {}

  ngOnInit(): void {
    this.loadShelf();
  }

  public loadShelf(): void {}
}
