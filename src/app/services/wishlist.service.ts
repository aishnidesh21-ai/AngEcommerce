import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { WishlistItem } from '../models/wishlist.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItems: WishlistItem[] = [];
  private wishlistSubject = new BehaviorSubject<WishlistItem[]>([]);
  private wishlistItemCountSubject = new BehaviorSubject<number>(0);
  
  // Observable for the wishlist item count
  wishlistItemCount$ = this.wishlistItemCountSubject.asObservable();

  constructor() {
    // Load wishlist from localStorage on service initialization
    this.loadWishlist();
  }

  private loadWishlist(): void {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        this.wishlistItems = parsedWishlist.map((item: any) => ({
          ...item,
          dateAdded: new Date(item.dateAdded)
        }));
        this.wishlistSubject.next([...this.wishlistItems]);
        this.wishlistItemCountSubject.next(this.wishlistItems.length);
      } catch (error) {
        console.error('Error parsing wishlist from localStorage', error);
      }
    }
  }

  private saveWishlist(): void {
    localStorage.setItem('wishlist', JSON.stringify(this.wishlistItems));
    this.wishlistItemCountSubject.next(this.wishlistItems.length);
  }

  getWishlist(): Observable<WishlistItem[]> {
    return this.wishlistSubject.asObservable();
  }

  getWishlistCount(): Observable<number> {
    return this.wishlistItemCount$;
  }

  addToWishlist(productId: string): void {
    if (!this.isInWishlist(productId)) {
      const newItem: WishlistItem = {
        productId,
        dateAdded: new Date()
      };
      this.wishlistItems.push(newItem);
      this.wishlistSubject.next([...this.wishlistItems]);
      this.saveWishlist();
    }
  }

  removeFromWishlist(productId: string): void {
    const index = this.wishlistItems.findIndex(item => item.productId === productId);
    if (index !== -1) {
      this.wishlistItems.splice(index, 1);
      this.wishlistSubject.next([...this.wishlistItems]);
      this.saveWishlist();
    }
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistItems.some(item => item.productId === productId);
  }

  clearWishlist(): void {
    this.wishlistItems = [];
    this.wishlistSubject.next([]);
    this.saveWishlist();
  }
}