import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { MovieService } from '../../services/movie-service';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss',
})
export class Wishlist {
  wishlists = signal<any>({});
  confirmDelete = signal<string | null>(null);
  
  private router = inject(Router);
  private toastService = inject(ToastService);
  private movieService = inject(MovieService);

  ngOnInit() {
    const temp = localStorage.getItem('wishlists');
    this.wishlists.set(temp ? JSON.parse(temp) : {});
  }

  get wishlistNames() {
    return Object.keys(this.wishlists());
  }

  onBack() {
    this.router.navigate(['/search']);
  }

  toggleConfirmDelete(listName: string | null) {
    this.confirmDelete.set(listName);
  }

  deleteWishlist(listName: string) {
    const currentWishlists = { ...this.wishlists() };
    delete currentWishlists[listName];
    this.wishlists.set(currentWishlists);
    localStorage.setItem('wishlists', JSON.stringify(currentWishlists));
    this.toastService.success('Wishlist deleted');
    this.confirmDelete.set(null);
  }

  removeMovie(listName: string, imdbID: string) {
    const currentWishlists = { ...this.wishlists() };
    if (currentWishlists[listName]) {
      currentWishlists[listName] = currentWishlists[listName].filter(
        (m: any) => m.imdbID !== imdbID
      );
      this.wishlists.set(currentWishlists);
      localStorage.setItem('wishlists', JSON.stringify(currentWishlists));
      this.toastService.info(`Removed from ${listName}`);
    }
  }

  onMovieClick(movie: any) {
    this.movieService.selectedMovieData.set(movie);
    this.router.navigate(['/movie-details']);
  }
}
