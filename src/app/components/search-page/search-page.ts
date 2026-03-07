import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie-service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-page',
  imports: [FormsModule, CommonModule],
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss',
})
export class SearchPage {
  searchedMovie: string = '';
  private movieService = inject(MovieService);
  private router = inject(Router);
  apiMoviesList = signal<any[]>([]);
  currentPage = signal(1);
  movieCount = signal('');
  ngOnInit() {
    if (this.movieService.lastSearchQuery()) {
      this.searchedMovie = this.movieService.lastSearchQuery();
      this.Onsearch();
    } else {
      this.searchedMovie = '';
    }
  }
  Onsearch() {
    this.movieService.lastSearchQuery.set(this.searchedMovie);
    console.log(this.searchedMovie);
    this.movieService.searchMovies(this.searchedMovie,1).subscribe(
      (res) => {
        this.currentPage.set(1);
        console.log(res);
        // this.apiMoviesList = res.Search;
        // this.movieCount = res.totalResults
        this.apiMoviesList.set(res.Search);
        this.movieCount.set(res.totalResults);
        console.log(this.apiMoviesList);
      },
      (err) => {
        console.log(err);
      },
    );
  }

  onClick(data: any) {
    console.log('1. Clicked movie ID:', data.imdbID);
    this.movieService.selectedMovieData.set(data);
    this.router.navigate(['/movie-details']);
  }

  loadmore() {
  this.currentPage.update((page) => page + 1);

  this.movieService.searchMovies(this.searchedMovie , this.currentPage()).subscribe((res)=>{
    this.apiMoviesList.update((movies)=> [...movies,...res.Search])
  })

  }
}
