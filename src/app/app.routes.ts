import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Registration } from './registration/registration';
import { CreateShelf } from './create-shelf/create-shelf';
import { ShelfView } from './shelf/shelf-view';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'registration',
    component: Registration,
  },
  {
    path: 'new-shelf',
    component: CreateShelf,
  },
  {
    path: 'shelf/:shelfId',
    component: ShelfView,
    children: [
      {
        path: 'item/:itemId',
        children: [],
      },
    ],
  },
];
