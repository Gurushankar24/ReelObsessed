import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie-service';
import { Router } from '@angular/router';
import { SpinnerComponent } from '../spinner/spinner';
import { Header } from '../header/header';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-search-page',
  imports: [FormsModule, CommonModule,SpinnerComponent,Header],
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss',
})
export class SearchPage {
  searchedMovie: string = '';
  // add this line in your component class
  skeletons = Array(8).fill(0); // shows 8 skeleton cards
  private movieService = inject(MovieService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
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
    this.movieService.isloading.set(true);
    this.movieService.lastSearchQuery.set(this.searchedMovie);
    
    this.movieService.searchMovies(this.searchedMovie, 1).subscribe(
      (res) => {
        this.currentPage.set(1);
        
        if (res.Response === 'False') {
          this.apiMoviesList.set([]);
          this.movieCount.set('0');
          this.toastr.warning(res.Error || 'No movies found');
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
      (err) => {
        this.movieService.isloading.set(false);
        this.toastr.error('Something went wrong, try again');
      },
    );
  }

  onClick(data: any) {
    this.movieService.isloading.set(true);
    this.movieService.selectedMovieData.set(data);
    this.router.navigate(['/movie-details']);
  }

  loadmore() {
    this.currentPage.update((page) => page + 1);

    this.movieService.searchMovies(this.searchedMovie, this.currentPage()).subscribe(
      (res) => {
        if (res.Response === 'True' && res.Search) {
          this.apiMoviesList.update((movies) => [...movies, ...res.Search]);
        } else {
          this.toastr.info(res.Error || 'No more movies found');
        }
      },
      (err) => {
        this.toastr.error('Something went wrong, try again');
      }
    );
  }
}
