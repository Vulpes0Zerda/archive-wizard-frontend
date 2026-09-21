import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Registration } from './registration/registration';
import { CreateShelf } from './create-shelf/create-shelf';

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
    children: [
      {
        path: 'item/:itemId',
        children: [],
      },
    ],
  },
];
