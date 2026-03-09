import { Component } from '@angular/core';

@Component({
  selector: 'app-liked',
  imports: [],
  templateUrl: './liked.html',
  styleUrl: './liked.scss',
})
export class Liked {
 
   ngOnInit(){
   const existingMovies = localStorage.getItem("likedMovies")
   console.log(existingMovies)
   } 
}
