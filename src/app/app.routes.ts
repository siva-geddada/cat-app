import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then(m => m.HomeComponent)
  },
  {
    path: 'cat/:id',
    loadComponent: () => import('./features/cat-detail/cat-detail').then(m => m.CatDetailComponent)
  },
  {
    path: 'gallery',
    loadComponent: () => import('./features/gallery/gallery').then(m => m.Gallery)
  },
  {
    path: 'favorites',
    loadComponent: () => import('./features/favorites/favorites').then(m => m.Favorites)
  },
  {
    path: 'breeds',
    loadComponent: () => import('./features/breeds/breeds').then(m => m.Breeds)
  },
  {
    path: 'match',
    loadComponent: () => import('./features/cat-match/cat-match').then(m => m.CatMatch)
  }
];
