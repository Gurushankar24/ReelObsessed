import { HttpClient } from '@angular/common/http';
import { Injectable ,inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
 //  getinitalUrl :string =""
  private apiKey = 'ca3dab5d'
  private baseUrl = 'http://www.omdbapi.com'

  http = inject(HttpClient);


   searchMovies( query : string){
    const url = this.baseUrl + `?s=${query}&apikey=${this.apiKey}`
    return this.http.get<any>(url)
   }

   getMovieById( id : string){
    const url = this.baseUrl + `?i=${id}&apikey=${this.apiKey}`
    return this.http.get<any>(url)
   }
}
   
