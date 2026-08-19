import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { shelfTestJSON } from '../services/example-json/shelfTestJson';

@Component({
  selector: 'app-shelf-overview',
  imports: [RouterLink],
  templateUrl: './shelf-overview.html',
  styleUrl: './shelf-overview.scss',
})
export class ShelfOverview {
  shelfs = shelfTestJSON;
}
