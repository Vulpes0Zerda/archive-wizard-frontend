import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Registration } from './registration/registration/registration';

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
    path: '*',
    children: [
      {
        path: '*',
        children: [],
      },
    ],
  },
];
