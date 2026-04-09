import { Routes } from '@angular/router';

export const postsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./posts-list/posts-list.component').then((m) => m.PostsListComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./post-detail/post-detail.component').then((m) => m.PostDetailComponent),
  },
];
