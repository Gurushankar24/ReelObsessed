import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from "@angular/router"

@Component({
  selector: 'app-header',
  imports: [RouterOutlet],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private router = inject(Router)
  ToLiked(){
    this.router.navigate(['/liked'])
  }
  ToWatchlist(){
    this.router.navigate(['/wishlist'])
  }
}
 