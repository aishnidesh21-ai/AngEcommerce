import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSelectModule,
    MatSliderModule
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = true;
  error = false;
  categoryFilter: string | null = null;
  subcategoryFilter: string | null = null;
  searchTerm = '';
  
  // Filter options
  selectedCategory = '';
  selectedBrand = '';
  minPrice = 0;
  maxPrice = 10000;
  categories: string[] = ['electronics', 'clothing', 'books', 'home', 'beauty', 'sports'];
  brands: string[] = ['Adidas', 'H&M', 'Zara', 'Levis', 'Raymond', 'Gucci', 'USB', 'Burberry', 'Foxtale', 'Dot&Key', 'Lakme', 'Rayban', 'Titan', 'Olay'];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.categoryFilter = params['category'] || null;
      this.subcategoryFilter = params['subcategory'] || null;
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.loading = true;

    let productObservable: Observable<Product[]>;
    
    if (this.categoryFilter && this.subcategoryFilter) {
      productObservable = this.productService.getProductsByCategoryAndSubcategory(
        this.categoryFilter, this.subcategoryFilter);
    } else if (this.categoryFilter) {
      productObservable = this.productService.getProductsByCategory(this.categoryFilter);
    } else if (this.subcategoryFilter) {
      productObservable = this.productService.getProductsBySubcategory(this.subcategoryFilter);
    } else {
      productObservable = this.productService.getAllProducts();
    }

    productObservable.subscribe({
      next: (products) => {
        this.products = products;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filteredProducts = [...this.products];
    
    // Apply search filter
    if (this.searchTerm) {
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (this.selectedCategory) {
      filteredProducts = filteredProducts.filter(product => 
        product.category === this.selectedCategory
      );
    }
    
    // Apply brand filter
    if (this.selectedBrand) {
      filteredProducts = filteredProducts.filter(product => 
        product.brand === this.selectedBrand
      );
    }
    
    // Apply price filter
    filteredProducts = filteredProducts.filter(product => 
      product.price >= this.minPrice && product.price <= this.maxPrice
    );
    
    // Sort by newest first (based on createdAt date)
    filteredProducts.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA; // Descending order (newest first)
    });
    
    this.filteredProducts = filteredProducts;
  }

  onSearch(): void {
    this.applyFilters();
  }
  
  resetFilters(): void {
    this.selectedCategory = '';
    this.selectedBrand = '';
    this.minPrice = 0;
    this.maxPrice = 10000;
    this.searchTerm = '';
    this.applyFilters();
    this.snackBar.open('Filters have been reset', 'Close', {
      duration: 3000
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
    this.snackBar.open(`${product.name} added to cart!`, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
  
  isInWishlist(productId: string): boolean {
    return this.wishlistService.isInWishlist(productId);
  }
  
  toggleWishlist(event: Event, product: Product): void {
    event.stopPropagation();
    
    if (this.isInWishlist(product.id)) {
      this.wishlistService.removeFromWishlist(product.id);
      this.snackBar.open(`${product.name} removed from wishlist!`, 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    } else {
      this.wishlistService.addToWishlist(product.id);
      this.snackBar.open(`${product.name} added to wishlist!`, 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    }
  }
}
