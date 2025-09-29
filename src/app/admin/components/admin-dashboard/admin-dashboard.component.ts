import { Component, HostListener } from '@angular/core';
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
      <mat-toolbar color="primary" class="toolbar">
        <button mat-icon-button class="mobile-menu" (click)="sidenav.toggle()">
          <mat-icon>menu</mat-icon>
        </button>
        <span class="logo">⚡ Admin Dashboard</span>
        <span class="spacer"></span>
        <button mat-button color="warn" (click)="logout()">
          <mat-icon>logout</mat-icon>
          Logout
        </button>
      </mat-toolbar>
      
      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav #sidenav [mode]="isDesktop ? 'side' : 'over'" [opened]="isDesktop" class="sidenav">
          <mat-nav-list>
            <a mat-list-item routerLink="/admin/products" routerLinkActive="active">
              <mat-icon>inventory_2</mat-icon>
              <span>Products</span>
            </a>
            <a mat-list-item routerLink="/admin/products/new" routerLinkActive="active">
              <mat-icon>add_circle</mat-icon>
              <span>Add Product</span>
            </a>
          </mat-nav-list>
        </mat-sidenav>
        
        <mat-sidenav-content class="main-content">
          <div class="dashboard-cards">
            <div class="card" *ngFor="let card of cards">
              <mat-icon class="card-icon">{{card.icon}}</mat-icon>
              <div class="card-info">
                <h3>{{card.title}}</h3>
                <p>{{card.value}}</p>
              </div>
            </div>
          </div>
          <router-outlet></router-outlet>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    /* Layout */
    .admin-layout {
      height: 100vh;
      display: flex;
      flex-direction: column;
      font-family: 'Roboto', sans-serif;
    }

    /* Toolbar */
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 10;
      display: flex;
      align-items: center;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .logo {
      font-weight: 600;
      font-size: 1.3rem;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .mobile-menu {
      display: none;
      margin-right: 8px;
    }

    /* Sidenav */
    .sidenav-container {
      flex: 1;
      height: 100%;
    }
    .sidenav {
      width: 240px;
      background: #ffffff;
      border-right: 1px solid #e0e0e0;
      padding-top: 10px;
    }
    mat-nav-list a {
      border-radius: 8px;
      margin: 4px 8px;
      transition: all 0.2s;
      display: flex;
      align-items: center;
    }
    mat-nav-list a:hover {
      background: rgba(25, 118, 210, 0.1);
      transform: translateX(4px);
    }
    .active {
      background-color: rgba(25, 118, 210, 0.2) !important;
      font-weight: 600;
    }
    mat-icon {
      margin-right: 12px;
    }

    /* Main content */
    .main-content {
      padding: 24px;
      background: #f4f6f8;
      min-height: 100%;
      position: relative;
    }

    /* Dashboard cards */
    .dashboard-cards {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }
    .card {
      flex: 1 1 200px;
      background: #ffffff;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      box-shadow: 0 4px 8px rgba(0,0,0,0.05);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }
    .card-icon {
      font-size: 40px;
      color: #1976d2;
      margin-right: 16px;
    }
    .card-info h3 {
      margin: 0;
      font-size: 1rem;
      color: #555;
    }
    .card-info p {
      margin: 4px 0 0;
      font-size: 1.3rem;
      font-weight: 600;
      color: #111;
    }

    /* Responsive */
    @media (max-width: 960px) {
      .sidenav {
        width: 200px;
      }
      .mobile-menu {
        display: inline-flex;
      }
      .main-content {
        padding: 16px;
      }
      .dashboard-cards {
        flex-direction: column;
      }
    }
  `]
})
export class AdminDashboardComponent {
  isDesktop = window.innerWidth > 960;

  cards = [
    { title: 'Total Products', value: '120', icon: 'inventory_2' },
    { title: 'New Orders', value: '45', icon: 'shopping_cart' },
    { title: 'Active Users', value: '300', icon: 'people_alt' },
    { title: 'Revenue', value: '$12,500', icon: 'attach_money' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isDesktop = event.target.innerWidth > 960;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
