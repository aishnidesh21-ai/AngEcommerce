import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductApiService } from '../../../services/product-api.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{isEditMode ? 'Edit Product' : 'Add New Product'}}</mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="product-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Product Name</mat-label>
            <input matInput formControlName="name" placeholder="Enter product name">
            <mat-error *ngIf="productForm.get('name')?.hasError('required')">
              Product name is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" rows="4" placeholder="Enter product description"></textarea>
            <mat-error *ngIf="productForm.get('description')?.hasError('required')">
              Description is required
            </mat-error>
          </mat-form-field>

          <div class="form-row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Price</mat-label>
              <input matInput type="number" formControlName="price" placeholder="0.00">
              <span matPrefix>₹&nbsp;</span>
              <mat-error *ngIf="productForm.get('price')?.hasError('required')">
                Price is required
              </mat-error>
              <mat-error *ngIf="productForm.get('price')?.hasError('min')">
                Price must be greater than 0
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Stock Quantity</mat-label>
              <input matInput type="number" formControlName="stock" placeholder="0">
              <mat-error *ngIf="productForm.get('stock')?.hasError('required')">
                Stock quantity is required
              </mat-error>
              <mat-error *ngIf="productForm.get('stock')?.hasError('min')">
                Stock must be 0 or greater
              </mat-error>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Category</mat-label>
            <mat-select formControlName="category">
              <mat-option value="electronics">Electronics</mat-option>
              <mat-option value="clothing">Clothing</mat-option>
              <mat-option value="books">Books</mat-option>
              <mat-option value="home">Home & Garden</mat-option>
              <mat-option value="sports">Sports</mat-option>
              <mat-option value="toys">Toys</mat-option>
              <mat-option value="beauty">Beauty</mat-option>
              <mat-option value="automotive">Automotive</mat-option>
            </mat-select>
            <mat-error *ngIf="productForm.get('category')?.hasError('required')">
              Category is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Image URL</mat-label>
            <input matInput formControlName="image" placeholder="https://example.com/image.jpg">
            <mat-error *ngIf="productForm.get('image')?.hasError('required')">
              Image URL is required
            </mat-error>
            <mat-error *ngIf="productForm.get('image')?.hasError('pattern')">
              Please enter a valid URL
            </mat-error>
          </mat-form-field>

          <div class="image-preview" *ngIf="productForm.get('image')?.value">
            <img [src]="productForm.get('image')?.value" alt="Product preview" 
                 (error)="onImageError()" class="preview-image">
          </div>

          <div class="form-actions">
            <button mat-button type="button" (click)="goBack()">Cancel</button>
            <button mat-raised-button color="primary" type="submit" 
                    [disabled]="productForm.invalid || isSubmitting">
              {{isSubmitting ? 'Saving...' : (isEditMode ? 'Update Product' : 'Add Product')}}
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .product-form {
      max-width: 600px;
      margin: 0 auto;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    
    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }
    
    .half-width {
      flex: 1;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 24px;
    }
    
    .image-preview {
      margin-bottom: 16px;
      text-align: center;
    }
    
    .preview-image {
      max-width: 200px;
      max-height: 200px;
      object-fit: cover;
      border-radius: 8px;
      border: 1px solid #ddd;
    }
  `]
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  productId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductApiService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      category: ['', [Validators.required]],
      image: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i)]]
    });
  }

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.productId;

    if (this.isEditMode && this.productId) {
      this.loadProduct(this.productId);
    }
  }

  loadProduct(id: string) {
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          category: product.category,
          image: product.image
        });
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.snackBar.open('Error loading product', 'Close', { duration: 3000 });
        this.goBack();
      }
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.isSubmitting = true;
      const productData = this.productForm.value;

      const operation = this.isEditMode && this.productId
        ? this.productService.updateProduct(this.productId, productData)
        : this.productService.createProduct(productData);

      operation.subscribe({
        next: () => {
          const message = this.isEditMode ? 'Product updated successfully' : 'Product added successfully';
          this.snackBar.open(message, 'Close', { duration: 3000 });
          this.router.navigate(['/admin/products']);
        },
        error: (error) => {
          console.error('Error saving product:', error);
          this.snackBar.open('Error saving product', 'Close', { duration: 3000 });
          this.isSubmitting = false;
        }
      });
    }
  }

  onImageError() {
    this.snackBar.open('Invalid image URL or image failed to load', 'Close', { duration: 3000 });
  }

  goBack() {
    this.router.navigate(['/admin/products']);
  }
}