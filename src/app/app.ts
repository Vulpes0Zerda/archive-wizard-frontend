import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShelfOverview } from './shelf-overview/shelf-overview';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ShelfOverview],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
