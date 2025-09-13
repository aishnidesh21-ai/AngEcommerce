import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CartItem } from '../../models/user.model';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { CommonModule, CurrencyPipe } from '@angular/common';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


interface CartItemWithDetails extends CartItem {
  product?: Product;
  subtotal: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItemWithDetails[] = [];
  cartTotal = 0;
  loading = true;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCartItems();
    
    this.cartService.getCartTotal().subscribe(total => {
      this.cartTotal = total;
    });
  }

  loadCartItems(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = [];
      
      // If cart is empty, set loading to false
      if (items.length === 0) {
        this.loading = false;
        return;
      }
      
      // Load product details for each cart item
      items.forEach(item => {
        this.productService.getProductById(item.productId).subscribe({
          next: (product) => {
            if (product) {
              this.cartItems.push({
                ...item,
                product: product,
                subtotal: item.price * item.quantity
              });
            }
            
            // Set loading to false when all items are loaded
            if (this.cartItems.length === items.length) {
              this.loading = false;
            }
          },
          error: (err) => {
            console.error('Error loading product details', err);
            // Still mark as loaded even if there's an error
            if (this.cartItems.length === items.length) {
              this.loading = false;
            }
          }
        });
      });
    });
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity < 1) return;
    
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }
}