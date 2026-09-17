import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShelfOverview } from './shelf-overview/shelf-overview';
import { Store } from '@ngxs/store';
import { AuthActions } from './services/state/auth/auth.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ShelfOverview],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  constructor(protected store: Store) {}
  ngOnInit(): void {
    this.store.dispatch(AuthActions.Refresh);
  }
}
