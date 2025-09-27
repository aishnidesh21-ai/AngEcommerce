export interface Product {
  id: string;               // use string to match MongoDB _id
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  subcategory?: string;
  inStock: boolean;
  stock?: number;           // added to track stock quantity
  rating?: number;          // optional because new products may not have ratings
  ratingCount?: number;     // optional to calculate average rating
  reviews?: Review[];
  brand?: string;
  createdAt?: string;       // added for sorting by date
  updatedAt?: string;       // optional
}

export interface Review {
  id: string;               // use string to match MongoDB _id
  userId: string;           // user id as string
  userName: string;
  rating: number;
  comment: string;
  date: string | Date;      // store as ISO string or Date
}
