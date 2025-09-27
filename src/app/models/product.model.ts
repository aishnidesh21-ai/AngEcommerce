export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  subcategory?: string;
  inStock: boolean;
  rating: number;
  reviews?: Review[];
  brand?: string;        // 👈 added brand
  
}

export interface Review {
  id: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
}
