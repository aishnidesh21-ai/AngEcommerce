import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CartItem } from '../../models/user.model';

interface CartItemWithDetails extends CartItem {
  product?: Product;
  subtotal?: number;
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
  error = false;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.error = false;

    this.cartService.getCartItems().subscribe({
      next: (items) => {
        this.cartItems = items.map(item => ({ ...item }));
        if (this.cartItems.length === 0) {
          this.cartTotal = 0;
          this.loading = false;
          return;
        }

        let loadedCount = 0;
        this.cartItems.forEach((item, index) => {
          this.productService.getProductById(item.productId).subscribe({
            next: (product) => {
              if (product) {
                this.cartItems[index].product = product;
                this.cartItems[index].subtotal = product.price * item.quantity;
              }
              loadedCount++;
              if (loadedCount === this.cartItems.length) {
                this.calculateTotal();
                this.loading = false;
              }
            },
            error: () => {
              loadedCount++;
              if (loadedCount === this.cartItems.length) {
                this.calculateTotal();
                this.loading = false;
              }
            }
          });
        });
      },
      error: (err) => {
        console.error('Error loading cart', err);
        this.error = true;
        this.loading = false;
      }
    });

    // Subscribe to total from CartService
    this.cartService.getCartTotal().subscribe(total => {
      this.cartTotal = total;
    });
  }

  calculateTotal(): void {
    this.cartTotal = this.cartItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  }

  updateQuantity(productId: string, newQty: number): void {
    this.cartService.updateQuantity(productId, newQty);
    const item = this.cartItems.find(ci => ci.productId === productId);
    if (item && item.product) {
      item.quantity = newQty;
      item.subtotal = item.product.price * newQty;
      this.calculateTotal();
    }
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId);
    this.cartItems = this.cartItems.filter(item => item.productId !== productId);
    this.calculateTotal();
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.cartItems = [];
    this.cartTotal = 0;
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }
}
