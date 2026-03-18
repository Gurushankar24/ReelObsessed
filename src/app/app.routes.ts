import { Routes } from '@angular/router';
import { SearchPage } from './components/search-page/search-page';
import { MovieDetails } from './components/movie-details/movie-details';
import { Liked } from './components/liked/liked';
import { Header } from './components/header/header';
import { Wishlist } from './components/wishlist/wishlist';

export const routes: Routes = [
  {
    path: '',
    component: Header,
    children: [
      { path: '', component: SearchPage },
      { path: 'search', component: SearchPage },
      { path: 'liked', component: Liked },
      { path: 'wishlist', component: Wishlist },
    ],
  },
  { path: 'movie-details', component: MovieDetails },
];
