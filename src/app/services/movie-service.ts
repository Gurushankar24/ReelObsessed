import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private apiKey = 'ca3dab5d';
  private baseUrl = 'http://www.omdbapi.com';

  // TMDB (The Movie Database) support
  private tmdbApiKey = '0624a87754d7f573d8429188a109ecf3'; // Common demo key for TMDB
  private tmdbBaseUrl = 'https://api.themoviedb.org/3';

  selectedMovieData = signal<any>('');
  lastSearchQuery = signal<string>('');
  isloading = signal<boolean>(false);

  http = inject(HttpClient);

  searchMovies(query: string, page: number) {
    const url = this.baseUrl + `?s=${query}&page=${page}&apikey=${this.apiKey}`;
    return this.http.get<any>(url);
  }

  getMovieById(id: string) {
    const url = this.baseUrl + `?i=${id}&apikey=${this.apiKey}`;
    return this.http.get<any>(url);
  }

  // TMDB Methods
  getGenres() {
    const url = `${this.tmdbBaseUrl}/genre/movie/list?api_key=${this.tmdbApiKey}`;
    return this.http.get<any>(url);
  }

  discoverMovies(params: { genre?: string; sortBy?: string; year?: string }, page: number) {
    let url = `${this.tmdbBaseUrl}/discover/movie?api_key=${this.tmdbApiKey}&page=${page}`;

    if (params.genre) url += `&with_genres=${params.genre}`;
    if (params.sortBy) url += `&sort_by=${params.sortBy}`;
    if (params.year) url += `&primary_release_year=${params.year}`;

    return this.http.get<any>(url).pipe(
      map((res: any) => ({
        Response: 'True',
        totalResults: res.total_results.toString(),
        Search: res.results.map((m: any) => ({
          Title: m.title,
          Year: m.release_date?.split('-')[0] || 'N/A',
          imdbID: m.id.toString(), // We use TMDB ID as ID for now
          Type: 'movie',
          Poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : 'N/A',
          tmdbId: m.id // Keep original TMDB ID
        }))
      }))
    );
  }
}
   
