import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

interface Order {
  _id: string;
  items: Array<{
    product: {
      _id: string;
      name: string;
      price: number;
      image: string;
    };
    quantity: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatTableModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>My Orders</mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <div class="loading-container" *ngIf="isLoading">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
        
        <div *ngIf="!isLoading && orders.length === 0" class="no-orders">
          <p>You haven't placed any orders yet.</p>
          <button mat-raised-button color="primary" routerLink="/products">
            Start Shopping
          </button>
        </div>
        
        <div *ngIf="!isLoading && orders.length > 0" class="orders-container">
          <div *ngFor="let order of orders" class="order-card">
            <div class="order-header">
              <div>
                <h3>Order #{{order._id | slice:0:8}}</h3>
                <p class="order-date">Placed on {{order.createdAt | date:'medium'}}</p>
              </div>
              <div>
                <mat-chip [color]="getStatusColor(order.status)" selected>
                  {{order.status | titlecase}}
                </mat-chip>
              </div>
            </div>
            
            <div class="order-items">
              <div *ngFor="let item of order.items" class="order-item">
                <div class="item-image">
                  <img [src]="item.product.image" [alt]="item.product.name">
                </div>
                <div class="item-details">
                  <h4>{{item.product.name}}</h4>
                  <p>Quantity: {{item.quantity}}</p>
                  <p>Price: ₹{{item.product.price | number:'1.2-2'}}</p>
                </div>
              </div>
            </div>
            
            <div class="order-footer">
              <p class="order-total">Total: ₹{{order.totalAmount | number:'1.2-2'}}</p>
              <button mat-button color="primary">View Details</button>
            </div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 200px;
    }
    
    .no-orders {
      text-align: center;
      padding: 40px 0;
    }
    
    .orders-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .order-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 16px;
    }
    
    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .order-date {
      color: #757575;
      font-size: 14px;
      margin-top: 4px;
    }
    
    .order-items {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 16px;
    }
    
    .order-item {
      display: flex;
      gap: 16px;
    }
    
    .item-image {
      width: 80px;
      height: 80px;
      flex-shrink: 0;
    }
    
    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }
    
    .item-details h4 {
      margin: 0 0 8px 0;
    }
    
    .item-details p {
      margin: 4px 0;
      color: #616161;
    }
    
    .order-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid #f0f0f0;
    }
    
    .order-total {
      font-weight: bold;
      font-size: 16px;
    }
  `]
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = [];
  isLoading = true;
  
  private apiUrl = 'http://localhost:8082/api/orders/my-orders';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    const headers = this.getAuthHeaders();
    
    this.http.get<Order[]>(this.apiUrl, { headers }).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.isLoading = false;
      }
    });
  }

  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case 'delivered':
        return 'primary';
      case 'shipped':
      case 'processing':
        return 'accent';
      case 'cancelled':
        return 'warn';
      default:
        return 'accent';
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
}