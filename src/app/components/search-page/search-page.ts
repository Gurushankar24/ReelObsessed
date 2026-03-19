import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie-service';
import { Router } from '@angular/router';
import { SpinnerComponent } from '../spinner/spinner';
import { Header } from '../header/header';
import { ToastService } from '../../services/toast.service';


@Component({
  selector: 'app-search-page',
  imports: [FormsModule, CommonModule,SpinnerComponent],
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss',
})
export class SearchPage {
  searchedMovie: string = '';
  // add this line in your component class
  skeletonItems = Array.from({length: 5}, (_, i) => i + 1); // unique values
  movieService = inject(MovieService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  apiMoviesList = signal<any[]>([]);
  currentPage = signal(1);
  movieCount = signal('');

  // Filters
  genres = signal<any[]>([]);
  selectedGenre = signal('');
  selectedSort = signal('popularity.desc');
  selectedYear = signal('');
  
  ngOnInit() {
    this.fetchGenres();
    if (this.movieService.lastSearchQuery()) {
      this.searchedMovie = this.movieService.lastSearchQuery();
      this.Onsearch();
    } else {
      // Show popular movies by default on empty search if possible
      this.Onsearch();
    }
  }

  fetchGenres() {
    this.movieService.getGenres().subscribe({
      next: (res) => this.genres.set(res.genres),
      error: () => this.toastService.error('Failed to load genres'),
    });
  }

  Onsearch() {
    this.movieService.isloading.set(true);
    this.movieService.lastSearchQuery.set(this.searchedMovie);
    
    // Determine whether to use Discovery (Filters) or Search (Query)
    // If there is a text search and no genre/year filter, use OMDB
    const useDiscovery = this.selectedGenre() || this.selectedYear() || !this.searchedMovie;
    
    const request = useDiscovery 
      ? this.movieService.discoverMovies({ genre: this.selectedGenre(), sortBy: this.selectedSort(), year: this.selectedYear() }, 1)
      : this.movieService.searchMovies(this.searchedMovie, 1);

    request.subscribe({
      next: (res) => {
        this.currentPage.set(1);
        
        if (res.Response === 'False') {
          this.apiMoviesList.set([]);
          this.movieCount.set('0');
          this.toastService.warning(res.Error || 'No movies found');
          this.movieService.isloading.set(false);
          return;
        }

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
        this.movieService.isloading.set(false);
        this.toastService.error('Something went wrong, try again');
      },
    });
  }

  onFilterChange() {
    this.currentPage.set(1);
    this.Onsearch();
  }

  onClick(data: any) {
    this.movieService.isloading.set(true);
    this.movieService.selectedMovieData.set(data);
    this.router.navigate(['/movie-details']);
  }

  loadmore() {
    this.currentPage.update((page) => page + 1);
    const useDiscovery = this.selectedGenre() || this.selectedYear() || !this.searchedMovie;

    const request = useDiscovery
      ? this.movieService.discoverMovies({ genre: this.selectedGenre(), sortBy: this.selectedSort(), year: this.selectedYear() }, this.currentPage())
      : this.movieService.searchMovies(this.searchedMovie, this.currentPage());

    request.subscribe({
      next: (res) => {
        if (res.Response === 'True' && res.Search) {
          this.apiMoviesList.update((movies) => [...movies, ...res.Search]);
        } else {
          this.toastService.info(res.Error || 'No more movies found');
        }
      },
      error: (err) => {
        this.toastService.error('Something went wrong, try again');
      }
  });
    
  }
}
