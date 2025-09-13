import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from './services/cart.service';
import { WishlistService } from './services/wishlist.service';

// Angular Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatToolbarModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ecommerce-app';
  cartItemCount = 0;
  wishlistItemCount = 0;

  // ✅ Add this property
  currentYear: number = new Date().getFullYear();
  
  constructor(
    private cartService: CartService,
    private router: Router,
    private wishlistService: WishlistService
  ) {}
  
  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItemCount = items.reduce((count, item) => count + item.quantity, 0);
    });
    
    this.wishlistService.wishlistItemCount$.subscribe(count => {
      this.wishlistItemCount = count;
    });
  }
  
  navigateToCart(): void {
    this.router.navigate(['/cart']);
  }
  
  navigateToWishlist(): void {
    this.router.navigate(['/wishlist']);
  }
}
