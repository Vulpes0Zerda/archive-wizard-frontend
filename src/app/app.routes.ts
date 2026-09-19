import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Registration } from './registration/registration';

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
    path: 'shelf',
    children: [
      {
        path: '*',
        children: [],
      },
    ],
  },
];
