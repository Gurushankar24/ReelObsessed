// movie-service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private readonly baseUrl = environment.omdbBaseUrl;
  private readonly apiKey = environment.omdbApiKey;

  selectedMovieData = signal<any>('');
  lastSearchQuery = signal<string>('');
  isloading = signal<boolean>(false);
  apiMoviesList = signal<any[]>([]);
  currentPage = signal(1);
  movieCount = signal('');

  private http = inject(HttpClient);

  searchMovies(query: string, page: number) {
    return this.http.get<any>(this.baseUrl, {
      params: { s: query, page, apikey: this.apiKey },
    });
  }

  getMovieById(id: string) {
    return this.http.get<any>(this.baseUrl, {
      params: { i: id, apikey: this.apiKey },
    });
  }
}