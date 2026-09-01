import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { shelfTestJSON } from '../services/example-json/shelfTestJson';
import { ApiService } from '../services/api/api.service';
import { GetShelf } from '../services/request/GetShelf';

@Component({
  selector: 'app-shelf-overview',
  imports: [RouterLink],
  templateUrl: './shelf-overview.html',
  styleUrl: './shelf-overview.scss',
})
export class ShelfOverview implements OnInit {
  protected shelfs: WritableSignal<Array<GetShelf>> = signal(new Array());

  public constructor(private apiService: ApiService){} 

  ngOnInit(): void {
    this.loadShelf()
  }

  public loadShelf():void{
    this.apiService.getShelfs(3).subscribe({
      next: (data)=>{this.shelfs.set(data)}, 
      error: (error)=> {new Error(error)}
    }); //TODO: 1 has to be changed
  }
}
