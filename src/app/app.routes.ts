import { Routes } from '@angular/router';
import { SearchPage } from './components/search-page/search-page';
import { MovieDetails } from './components/movie-details/movie-details';
import { Liked } from './components/liked/liked';
import { Header } from './components/header/header';
export const routes: Routes = [
  {
    path: '',
    component: Header,
    children: [
      { path: '', component: SearchPage },
      { path: 'search', component: SearchPage },
   
      { path: 'liked', component: Liked },
    ],
     
  },

    { path: 'movie-details', component: MovieDetails },
];
