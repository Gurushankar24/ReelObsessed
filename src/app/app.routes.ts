import { Routes } from '@angular/router';
import { SearchPage } from './components/search-page/search-page';
import { MovieDetails } from './components/movie-details/movie-details';


export const routes: Routes = [
  
    {path:'search' , component : SearchPage},
    {path: 'movie-details', component : MovieDetails},
   
];
