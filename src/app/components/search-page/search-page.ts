import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie-service';
import { Router } from '@angular/router';
import { SpinnerComponent } from '../spinner/spinner';


@Component({
  selector: 'app-search-page',
  imports: [FormsModule, CommonModule,SpinnerComponent],
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss',
})
export class SearchPage {
  searchedMovie: string = '';
  // add this line in your component class
  skeletons = Array(8).fill(0); // shows 8 skeleton cards
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
    // this.isLoading.set(true); 
    this.movieService.isloading.set(true);
    console.log(this.movieService.isloading())
    this.movieService.lastSearchQuery.set(this.searchedMovie);
    console.log(this.searchedMovie);
    this.movieService.searchMovies(this.searchedMovie, 1).subscribe(
      (res) => {
        this.currentPage.set(1);
        console.log(res);
       
        const unique = res.Search.filter((currentVal: any, index: number, wholeArray: any) => {
          return (
            index ===
            wholeArray.findIndex((x:any) => {
              return currentVal.imdbID === x.imdbID; // capital D both sides
            })
          );
        });
        console.log(unique)
        this.apiMoviesList.set(unique)
        this.movieCount.set(res.totalResults);
      //  this.isLoading.set(true);
        console.log(this.apiMoviesList);
       this.movieService.isloading.set(false);
       console.log(this.movieService.isloading())
      },
      (err) => {
        console.log(err);   
        this.movieService.isloading.set(false);
       console.log(this.movieService.isloading())     
      },
    );
  }

  onClick(data: any) {
    this.movieService.isloading.set(true);
    console.log('1. Clicked movie ID:', data.imdbID);
    this.movieService.selectedMovieData.set(data);
    this.router.navigate(['/movie-details']);
  }

  loadmore() {
    this.currentPage.update((page) => page + 1);

    this.movieService.searchMovies(this.searchedMovie, this.currentPage()).subscribe((res) => {
      this.apiMoviesList.update((movies) => [...movies, ...res.Search]);
    });
  }
}
