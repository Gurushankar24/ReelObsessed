import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MovieService } from '../../services/movie-service';
import { Router } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { ToastService } from '../../services/toast.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-movie-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.scss',
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class MovieDetails {
  private movieService = inject(MovieService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  selectedMovieDetails = signal<any>('');
  isliked = signal<boolean>(false);
  wishlists: any = {};
  showWishList = false;
  newWishListName : string =""
  isLoading = signal<boolean>(true);

  getActorsList(actors: string): string[] {
    if (!actors || actors === 'N/A') return [];
    return actors.split(',').map(a => a.trim());
  }

  ngOnInit() {
    const movieData = this.movieService.selectedMovieData();
    console.log(movieData)
    if (movieData && movieData.imdbID) {
      this.isLoading.set(true);
      this.movieService.getMovieById(movieData.imdbID).subscribe({
        next: (res) => {
          this.selectedMovieDetails.set(res);
          console.log(res)
          const temp = localStorage.getItem('likedMovies');
          const likedMovies = temp ? JSON.parse(temp) : [];
          const alreadyLiked = likedMovies.some((movie: any) => {
            return this.selectedMovieDetails().imdbID === movie.imdbID;
          });
          this.isliked.set(alreadyLiked);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('API Error:', err);
          this.isliked.set(false);
          this.isLoading.set(false);
          this.toastService.error('Something went wrong, try again');
        },
      });
    } else {
      this.isLoading.set(false);
    }
    const temp = localStorage.getItem('wishlists');
    this.wishlists = temp ? JSON.parse(temp) : {};
  }

  onBack() {
    this.movieService.selectedMovieData.set(null);
    this.router.navigate(['/search']);
  }

  OnlikedMovie(data: any) {
    console.log(data)
    const likedMovies = localStorage.getItem('likedMovies');
    let currentList = likedMovies ? JSON.parse(likedMovies) : [];
    const index = currentList.findIndex((movie: any) => movie.imdbID === data.imdbID);

    if (index === -1) {
      currentList.push(data);
      this.isliked.set(true);
      this.toastService.success('Added to Liked! ❤️');
    } else {
      currentList.splice(index, 1);
      this.isliked.set(false);
      this.toastService.info('Removed from Liked');
    }
    localStorage.setItem('likedMovies', JSON.stringify(currentList));
  }

  get wishlistnames() {
    return Object.keys(this.wishlists);
  }

  OnWishlist() {
    this.showWishList = !this.showWishList;
  }

  addawishlist(item: any) {
    const movie = this.selectedMovieDetails();
    const list = this.wishlists[item] || [];
    const alreadyInWishlist = list.some((m: any) => m.imdbID === movie.imdbID);

    if (alreadyInWishlist) {
      this.toastService.warning('Already in your Wishlist');
      return;
    }

    // Immutive update to trigger Angular change detection for the previews
    this.wishlists[item] = [...list, movie];
    this.wishlists = { ...this.wishlists }; 
    localStorage.setItem("wishlists", JSON.stringify(this.wishlists));
    this.toastService.success('Saved to Wishlist! 🎬');
  }

  addawishnewlist(){
    if (!this.newWishListName) return;
    this.wishlists[this.newWishListName] = [];
    this.wishlists = { ...this.wishlists }; 
    localStorage.setItem("wishlists", JSON.stringify(this.wishlists));
    this.newWishListName = "";
  }
}
 