import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: Array<{
    product: {
      _id: string;
      name: string;
      price: number;
    };
    quantity: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Orders Management</mat-card-title>
        <mat-card-subtitle>View and manage all customer orders</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <div class="loading-container" *ngIf="isLoading">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
        
        <div class="table-container" *ngIf="!isLoading">
          <table mat-table [dataSource]="orders" class="mat-elevation-z2">
            <!-- Order ID Column -->
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>Order ID</th>
              <td mat-cell *matCellDef="let order">{{order._id | slice:0:8}}...</td>
            </ng-container>
            
            <!-- Customer Column -->
            <ng-container matColumnDef="customer">
              <th mat-header-cell *matHeaderCellDef>Customer</th>
              <td mat-cell *matCellDef="let order">{{order.user?.name || 'Unknown'}}</td>
            </ng-container>
            
            <!-- Date Column -->
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Date</th>
              <td mat-cell *matCellDef="let order">{{order.createdAt | date:'medium'}}</td>
            </ng-container>
            
            <!-- Total Column -->
            <ng-container matColumnDef="total">
              <th mat-header-cell *matHeaderCellDef>Total</th>
              <td mat-cell *matCellDef="let order">₹{{order.totalAmount | number:'1.2-2'}}</td>
            </ng-container>
            
            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let order">
                <mat-chip [color]="getStatusColor(order.status)" selected>
                  {{order.status | titlecase}}
                </mat-chip>
              </td>
            </ng-container>
            
            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let order">
                <button mat-icon-button color="primary" (click)="viewOrderDetails(order)" matTooltip="View Details">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button mat-icon-button color="accent" (click)="updateOrderStatus(order)" matTooltip="Update Status">
                  <mat-icon>edit</mat-icon>
                </button>
              </td>
            </ng-container>
            
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            
            <!-- Row shown when there is no matching data -->
            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell" colspan="6">No orders found</td>
            </tr>
          </table>
          
          <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" 
                         [pageSize]="10"
                         showFirstLastButtons>
          </mat-paginator>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .table-container {
      width: 100%;
      overflow-x: auto;
    }
    
    table {
      width: 100%;
    }
    
    .mat-column-actions {
      width: 120px;
      text-align: center;
    }
    
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 200px;
    }
    
    .mat-column-id {
      max-width: 100px;
    }
    
    .mat-column-status {
      width: 120px;
      text-align: center;
    }
  `]
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  displayedColumns: string[] = ['id', 'customer', 'date', 'total', 'status', 'actions'];
  isLoading = true;
  
  private apiUrl = 'productId: stringhttps://angecombackend.onrender.com/api/orders';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private snackBar: MatSnackBar
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
        this.snackBar.open('Error loading orders', 'Close', { duration: 3000 });
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

  viewOrderDetails(order: Order): void {
    // Implement order details view
    console.log('View order details:', order);
  }

  updateOrderStatus(order: Order): void {
    // Implement status update functionality
    console.log('Update order status:', order);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
}