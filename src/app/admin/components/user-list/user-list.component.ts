import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService, User } from '../../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Users Management</mat-card-title>
        <mat-card-subtitle>Manage all registered users</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <div class="loading-container" *ngIf="isLoading">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
        
        <div class="table-container" *ngIf="!isLoading">
          <table mat-table [dataSource]="users" matSort (matSortChange)="sortData($event)" class="mat-elevation-z2">
            <!-- ID Column -->
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
              <td mat-cell *matCellDef="let user">{{user._id | slice:0:8}}...</td>
            </ng-container>
            
            <!-- Name Column -->
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
              <td mat-cell *matCellDef="let user">{{user.name}}</td>
            </ng-container>
            
            <!-- Email Column -->
            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>
              <td mat-cell *matCellDef="let user">{{user.email}}</td>
            </ng-container>
            
            <!-- Role Column -->
            <ng-container matColumnDef="role">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Role</th>
              <td mat-cell *matCellDef="let user">
                <mat-chip [color]="user.role === 'admin' ? 'accent' : 'primary'" selected>
                  {{user.role}}
                </mat-chip>
              </td>
            </ng-container>
            
            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
              <td mat-cell *matCellDef="let user">
                <mat-chip [color]="user.isActive ? 'primary' : 'warn'" selected>
                  {{user.isActive ? 'Active' : 'Inactive'}}
                </mat-chip>
              </td>
            </ng-container>
            
            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let user">
                <button mat-icon-button color="primary" (click)="toggleUserStatus(user)" 
                        [matTooltip]="user.isActive ? 'Deactivate User' : 'Activate User'">
                  <mat-icon>{{user.isActive ? 'block' : 'check_circle'}}</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteUser(user)" matTooltip="Delete User">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>
            
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            
            <!-- Row shown when there is no matching data -->
            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell" colspan="6">No users found</td>
            </tr>
          </table>
          
          <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" 
                         [pageSize]="10"
                         showFirstLastButtons
                         (page)="onPageChange($event)">
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
    
    .mat-column-role, .mat-column-status {
      width: 120px;
      text-align: center;
    }
  `]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'status', 'actions'];
  isLoading = true;
  
  private apiUrl = 'http://localhost:8082/api/users';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    const headers = this.getAuthHeaders();
    
    this.http.get<User[]>(this.apiUrl, { headers }).subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.snackBar.open('Error loading users', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  sortData(sort: Sort): void {
    // Handle sorting logic if needed
  }

  onPageChange(event: PageEvent): void {
    // Handle pagination if needed
  }

  toggleUserStatus(user: User): void {
    const headers = this.getAuthHeaders();
    const updatedStatus = !user.isActive;
    
    this.http.patch<User>(`${this.apiUrl}/${user._id}/status`, 
      { isActive: updatedStatus }, 
      { headers }
    ).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u._id === user._id);
        if (index !== -1) {
          this.users[index].isActive = updatedUser.isActive;
        }
        
        const message = updatedUser.isActive ? 'User activated' : 'User deactivated';
        this.snackBar.open(message, 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error updating user status:', error);
        this.snackBar.open('Error updating user status', 'Close', { duration: 3000 });
      }
    });
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete user ${user.name}?`)) {
      const headers = this.getAuthHeaders();
      
      this.http.delete(`${this.apiUrl}/${user._id}`, { headers }).subscribe({
        next: () => {
          this.users = this.users.filter(u => u._id !== user._id);
          this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.snackBar.open('Error deleting user', 'Close', { duration: 3000 });
        }
      });
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