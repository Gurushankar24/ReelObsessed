import { CommonModule } from '@angular/common';
import { Component , inject, signal } from '@angular/core';
import { MovieService } from '../../services/movie-service';
import {Router} from '@angular/router'


@Component({
  selector: 'app-movie-details',
  imports: [CommonModule],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.scss',
})
export class MovieDetails {
  private movieService = inject(MovieService);
  private router = inject(Router);
  selectedMovieDetails =signal<any>("");
  ngOnInit() {
  const movieData = this.movieService.selectedMovieData();
  if (movieData && movieData.imdbID) {
    this.movieService.getMovieById(movieData.imdbID).subscribe({
      next: (res) => {
        console.log('3. API Response Received:', res);
        this.selectedMovieDetails.set(res)
        console.log(this.selectedMovieDetails());
      },
      error: (err) => console.error('API Error:', err),
    });
  }
  }

  onBack(){
    this.movieService.selectedMovieData.set(null);
    this.router.navigate(['/search'])
  }

  OnlikedMovie(data:any){
    console.log('hii iam likedmovies method')
    const likedMovies = localStorage.getItem('likedMovies')
    const currentList = likedMovies ? JSON.parse(likedMovies) : []
   currentList.push({
      title: data.Title,
      year: data.Year,
      poster : data.Poster,
      Released : data.Released,
    });  
          
    localStorage.setItem('likedMovies', JSON.stringify(currentList))
  }
 
  
}
