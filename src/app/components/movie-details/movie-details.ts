import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MovieService } from '../../services/movie-service';
import { Router } from '@angular/router';
import { findIndex } from 'rxjs';

@Component({
  selector: 'app-movie-details',
  imports: [CommonModule],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.scss',
})
export class MovieDetails {
  private movieService = inject(MovieService);
  private router = inject(Router);
  selectedMovieDetails = signal<any>('');
  isliked = signal<boolean>(false);
  ngOnInit() {
    const movieData = this.movieService.selectedMovieData();
    if (movieData && movieData.imdbID) {
      this.movieService.getMovieById(movieData.imdbID).subscribe({
        next: (res) => {
          console.log('3. API Response Received:', res);
          this.selectedMovieDetails.set(res);
          const temp = localStorage.getItem('likedMovies');
          const likedMovies = temp ? JSON.parse(temp) : [];
          const alreadyLiked = likedMovies.some((movie: any) => {
            return this.selectedMovieDetails().imdbID === movie.imdbID;
          });
          this.isliked.set(alreadyLiked);
          console.log(this.selectedMovieDetails());
        },
        error: (err) => {
          console.error('API Error:', err);
          this.isliked.set(false);
        },
      });
    }
  }

  onBack() {
    this.movieService.selectedMovieData.set(null);
    this.router.navigate(['/search']);
  }

  OnlikedMovie(data: any) {
    const likedMovies = localStorage.getItem('likedMovies');
    let currentList = likedMovies ? JSON.parse(likedMovies) : [];
    const index = currentList.findIndex((movie: any) => movie.imdbID === data.imdbID);
    
    if (index === -1) {
      currentList.push(data);
      this.isliked.set(true);
    } else {
      currentList.splice(index, 1);
      this.isliked.set(false);
    }
    localStorage.setItem('likedMovies', JSON.stringify(currentList));
  }

  OnWishlist(){
   const alreadywishlist = localStorage.getItem("wishlist")
  //  const name = alreadywishlist ? JSON.parse(alreadywishlist) : []

   console.log(name)
  }
}
