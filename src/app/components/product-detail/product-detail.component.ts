import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';    
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-detail',
  standalone: true,  
  imports: [
    CommonModule,  
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  quantity = 1;
  loading = true;
  error = false;
  isInWishlist = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const productId = params.get('id');   // ✅ keep as string
      if (productId) {
        this.loadProduct(productId);
      } else {
        this.error = true;
        this.loading = false;
      }
    });
  }

  loadProduct(id: string): void {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
        if (product) {
          this.checkIfInWishlist(product.id);
        }
      },
      error: (err) => {
        console.error('Error loading product', err);
        this.error = true;
        this.loading = false;
      }
    });
  }
  
  checkIfInWishlist(productId: string): void {
    this.isInWishlist = this.wishlistService.isInWishlist(productId);
  }

  incrementQuantity(): void {
    this.quantity++;
  }

  decrementQuantity(): void {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
      this.snackBar.open(`${this.product.name} added to cart!`, 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    }
  }
  
  toggleWishlist(): void {
    if (!this.product) return;
    
    if (this.isInWishlist) {
      this.wishlistService.removeFromWishlist(this.product.id);
      this.snackBar.open(`${this.product.name} removed from wishlist!`, 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    } else {
      this.wishlistService.addToWishlist(this.product.id);
      this.snackBar.open(`${this.product.name} added to wishlist!`, 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    }
    
    this.isInWishlist = !this.isInWishlist;
  }
  
  rateProduct(rating: number): void {
    if (this.product?.id) {
      this.productService.updateProductRating(this.product.id, rating).subscribe({
        next: (updatedProduct) => {
          if (updatedProduct) {
            this.product!.rating = updatedProduct.rating;
          }
          this.snackBar.open(`You rated this product ${rating} stars!`, 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error updating rating:', error);
          this.snackBar.open('Failed to update rating. Please try again.', 'Close', { duration: 3000 });
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
