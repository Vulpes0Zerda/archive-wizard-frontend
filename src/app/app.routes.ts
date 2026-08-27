import { Routes } from '@angular/router';
import { Authorization } from './authorization/authorization';

export const routes: Routes = [
  {
    path: 'login', 
    component: Authorization
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
