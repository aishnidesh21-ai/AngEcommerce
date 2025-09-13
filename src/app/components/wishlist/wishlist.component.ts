import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../services/wishlist.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { WishlistItem } from '../../models/wishlist.model';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CartService } from '../../services/cart.service';

interface WishlistItemWithDetails extends WishlistItem {
  product?: Product;
}

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlistItems: WishlistItemWithDetails[] = [];
  loading = true;
  error = false;

  constructor(
    private wishlistService: WishlistService,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.loading = true;
    this.wishlistService.getWishlist().subscribe(items => {
      this.wishlistItems = items.map(item => ({ ...item }));
      
      // Load product details for each wishlist item
      if (this.wishlistItems.length === 0) {
        this.loading = false;
        return;
      }
      
      let loadedCount = 0;
      this.wishlistItems.forEach((item, index) => {
        this.productService.getProductById(item.productId).subscribe({
          next: (product) => {
            if (product) {
              this.wishlistItems[index].product = product;
            }
            loadedCount++;
            if (loadedCount === this.wishlistItems.length) {
              this.loading = false;
            }
          },
          error: (err) => {
            console.error('Error loading product details', err);
            loadedCount++;
            if (loadedCount === this.wishlistItems.length) {
              this.loading = false;
            }
          }
        });
      });
    });
  }

  removeFromWishlist(productId: number): void {
    this.wishlistService.removeFromWishlist(productId);
    this.wishlistItems = this.wishlistItems.filter(item => item.productId !== productId);
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
  }

  viewProductDetails(productId: number): void {
    this.router.navigate(['/product', productId]);
  }

  clearWishlist(): void {
    this.wishlistService.clearWishlist();
    this.wishlistItems = [];
  }
}