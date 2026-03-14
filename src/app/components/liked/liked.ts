import { Component,signal,inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-liked',
  imports: [],
  templateUrl: './liked.html',
  styleUrl: './liked.scss',
})
export class Liked {
 existingMovies =signal<any>([]) 
 private router = inject(Router)
  ngOnInit(){
    const temp = localStorage.getItem("likedMovies")
    this.existingMovies.set(temp ? JSON.parse(temp) : [])
   console.log(this.existingMovies)
   } 

   OnBack(){
    this.router.navigate(['/search'])
   }
}
