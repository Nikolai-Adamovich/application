import { type Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home'),
    title: 'Home',
  },
  // {
  //   path: 'about',
  //   loadComponent: () => import('./pages/about/about'),
  //   title: 'About',
  // },
  // {
  //   path: 'authentication',
  //   loadComponent: () => import('./pages/authentication/authentication'),
  //   title: 'Authentication',
  // },
  // {
  //   path: 'user',
  //   loadComponent: () => import('./pages/user/user'),
  //   title: 'Profile',
  // },
  // {
  //   path: '**',
  //   loadComponent: () => import('./pages/not-found/not-found'),
  //   title: '404 - Not Found',
  // },
];
