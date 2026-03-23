import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie-service';
import { Router } from '@angular/router';
import { SpinnerComponent } from '../spinner/spinner';
import { ToastService } from '../../services/toast.service';


@Component({
  selector: 'app-search-page',
  imports: [FormsModule, CommonModule, SpinnerComponent],
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss',
})
export class SearchPage {
  searchedMovie: string = ''; // Default search to show something
  skeletonItems = Array.from({length: 5}, (_, i) => i + 1);
  movieService = inject(MovieService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  apiMoviesList = signal<any[]>([]);
  recentlyViewed = signal<any[]>([]);
  currentPage = signal(1);
  movieCount = signal('');
  hasSearched = signal(false);

  ngOnInit() {
    if (this.movieService.lastSearchQuery()) {
      this.searchedMovie = this.movieService.lastSearchQuery();
    }
    this.loadRecentlyViewed();
    this.Onsearch();
  }

  loadRecentlyViewed() {
    const saved = localStorage.getItem('recentlyViewed');
    if (saved) {
      this.recentlyViewed.set(JSON.parse(saved));
    }
  }

  clearRecentlyViewed() {
    localStorage.removeItem('recentlyViewed');
    this.recentlyViewed.set([]);
  }

  Onsearch() {
    if (!this.searchedMovie.trim()) {
      this.hasSearched.set(false);
      this.apiMoviesList.set([]);
      return;
    }

    this.movieService.isloading.set(true);
    this.hasSearched.set(true);
    this.movieService.lastSearchQuery.set(this.searchedMovie);
    
    this.movieService.searchMovies(this.searchedMovie, 1).subscribe({
      next: (res) => {
        this.currentPage.set(1);
        
        if (res.Search) {
          const unique = res.Search.filter((currentVal: any, index: number, wholeArray: any) => {
            return (
              index ===
              wholeArray.findIndex((x: any) => {
                return currentVal.imdbID === x.imdbID;
              })
            );
          });
          this.apiMoviesList.set(unique);
          this.movieCount.set(res.totalResults);
        }
        
        this.movieService.isloading.set(false);
      },
      error: (err) => {
        this.apiMoviesList.set([]);
        this.movieCount.set('0');
        this.movieService.isloading.set(false);
      },
    });
  }

  onInputChange() {
    if (!this.searchedMovie.trim()) {
      this.hasSearched.set(false);
      this.apiMoviesList.set([]);
    }
  }

  onClick(data: any) {
    this.movieService.isloading.set(true);
    
    // Recently Viewed Logic
    let current = [...this.recentlyViewed()];
    const index = current.findIndex(m => m.imdbID === data.imdbID);
    
    if (index !== -1) {
      current.splice(index, 1);
    }
    
    current.unshift(data);
    if (current.length > 10) {
      current = current.slice(0, 10);
    }
    
    localStorage.setItem('recentlyViewed', JSON.stringify(current));
    this.recentlyViewed.set(current);

    this.movieService.selectedMovieData.set(data);
    this.router.navigate(['/movie-details']);
  }

  loadmore() {
    if (!this.searchedMovie.trim()) return;

    this.currentPage.update((page) => page + 1);
    
    this.movieService.searchMovies(this.searchedMovie, this.currentPage()).subscribe({
      next: (res) => {
        if (res.Response === 'True' && res.Search) {
          this.apiMoviesList.update((movies) => [...movies, ...res.Search]);
        } else {
          this.toastService.info(res.Error || 'No more movies found');
        }
      },
      error: (err) => {
      }
    });
  }
}
