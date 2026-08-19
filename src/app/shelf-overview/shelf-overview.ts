import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { shelfTestJSON } from '../services/example-json/shelfTestJson';
import { ApiService } from '../services/api/api.service';
import { GetShelf } from '../services/models/GetShelf';

@Component({
  selector: 'app-shelf-overview',
  imports: [RouterLink],
  templateUrl: './shelf-overview.html',
  styleUrl: './shelf-overview.scss',
})
export class ShelfOverview {
  private shelfs: Array<GetShelf> = new Array();

  public constructor(private apiService: ApiService){}

  public loadShelf():void{
    this.apiService.getShelfs(1).subscribe({
      next: (data)=>{this.shelfs=data}, 
      error: (error)=> {new Error(error)}
    }); //TODO: 1 has to be changed
  }
}
