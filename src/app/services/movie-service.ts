import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private api Key = 'ca3dab5d';
  private baseUrl = 'http://www.omdbapi.com';

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
}
