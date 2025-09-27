import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule
  ],
  template: `
    <div class="admin-layout">
      <mat-toolbar color="primary">
        <span>Admin Dashboard</span>
        <span class="spacer"></span>
        <button mat-button (click)="logout()">
          <mat-icon>logout</mat-icon>
          Logout
        </button>
      </mat-toolbar>
      
      <div class="admin-content">
        <mat-sidenav-container class="sidenav-container">
          <mat-sidenav mode="side" opened class="sidenav">
            <mat-nav-list>
              <a mat-list-item routerLink="/admin/products" routerLinkActive="active">
                <mat-icon>inventory</mat-icon>
                <span>Products</span>
              </a>
              <a mat-list-item routerLink="/admin/products/new" routerLinkActive="active">
                <mat-icon>add</mat-icon>
                <span>Add Product</span>
              </a>
            </mat-nav-list>
          </mat-sidenav>
          
          <mat-sidenav-content class="main-content">
            <router-outlet></router-outlet>
          </mat-sidenav-content>
        </mat-sidenav-container>
      </div>
    </div>
  `,
  styles: [`
    .admin-layout {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .admin-content {
      flex: 1;
      overflow: hidden;
    }
    
    .sidenav-container {
      height: 100%;
    }
    
    .sidenav {
      width: 250px;
      background: #f5f5f5;
    }
    
    .main-content {
      padding: 20px;
    }
    
    .active {
      background-color: #e3f2fd !important;
    }
    
    mat-list-item {
      margin-bottom: 8px;
    }
    
    mat-icon {
      margin-right: 16px;
    }
  `]
})
export class AdminDashboardComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}