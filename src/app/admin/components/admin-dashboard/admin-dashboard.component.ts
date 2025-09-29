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
      <mat-toolbar color="primary" class="toolbar">
        <span class="logo">⚡ Admin Dashboard</span>
        <span class="spacer"></span>
        <button mat-button color="warn" (click)="logout()">
          <mat-icon>logout</mat-icon>
          Logout
        </button>
      </mat-toolbar>
      
      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav #sidenav mode="side" [opened]="isDesktop" class="sidenav" fixedInViewport>
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
          <button mat-icon-button class="mobile-menu" (click)="sidenav.toggle()">
            <mat-icon>menu</mat-icon>
          </button>
          <router-outlet></router-outlet>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .admin-layout {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .toolbar {
      position: sticky;
      top: 0;
      z-index: 10;
      display: flex;
      justify-content: space-between;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .logo {
      font-weight: 600;
      font-size: 1.2rem;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .sidenav-container {
      flex: 1;
      display: flex;
      height: 100%;
    }

    .sidenav {
      width: 240px;
      background: #ffffff;
      border-right: 1px solid #e0e0e0;
    }

    mat-nav-list a {
      border-radius: 8px;
      margin: 4px 8px;
      transition: all 0.2s;
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

    .main-content {
      padding: 24px;
      background: #f4f6f8;
      min-height: 100%;
      position: relative;
    }

    .mobile-menu {
      display: none;
      position: absolute;
      top: 16px;
      left: 16px;
      z-index: 20;
    }

    @media (max-width: 960px) {
      .sidenav {
        width: 200px;
      }

      .mobile-menu {
        display: inline-flex;
      }

      mat-sidenav {
        position: fixed;
        z-index: 30;
      }

      .main-content {
        padding: 16px;
      }
    }
  `]
})
export class AdminDashboardComponent {
  isDesktop = window.innerWidth > 960;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
