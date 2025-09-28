import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrl + '/products';

  // Local products fallback
  private localProducts: Product[] = [
    // Men's Clothing
    { id:'1', name: 'Men\'s Casual Shirt', description: 'Comfortable cotton casual shirt for men', price: 2100, imageUrl: 'https://cdn.shopify.com/s/files/1/0981/8178/files/tone-on-tone-dressing-blue-oxford-shirt.jpg?5470127182368086585', category: 'clothing', subcategory: 'men', inStock: true, rating: 4.5, brand: 'H&M' },
    { id: '2', name: 'Women\'s Summer Dress', description: 'Lightweight summer dress for women', price: 2400, imageUrl: 'https://i.pinimg.com/originals/00/1f/a4/001fa4eb2d9ba2075dacf504b87f51cc.jpg', category: 'clothing', subcategory: 'women', inStock: true, rating: 4.8, brand: 'Zara' },
    { id: '3', name: 'Men\'s Jeans', description: 'Classic blue jeans for men', price: 1800, imageUrl: 'https://tse1.explicit.bing.net/th/id/OIP.u3dhIhSe6bycerdXl7WCAAHaJ4?cb=ucfimgc2&rs=1&pid=ImgDetMain&o=7&rm=3', category: 'clothing', subcategory: 'men', inStock: true, rating: 4.9, brand: 'Levis' },
    { id: '4', name: 'Women\'s Top', description: 'Elegant Top for women', price: 1500, imageUrl: 'https://i.pinimg.com/originals/51/a8/f5/51a8f5f431a45b41eef60818d1475276.jpg', category: 'clothing', subcategory: 'women', inStock: true, rating: 4.6, brand: 'Zara' },
    { id: '5', name: 'Men\'s Sneakers', description: 'Comfortable sneakers for men', price: 1900, imageUrl: 'https://cdn11.bigcommerce.com/s-pkla4xn3/images/stencil/1280x1280/products/20743/182602/AODLEE-Fashion-Men-Sneakers-for-Men-Casual-Shoes-Breathable-Lace-up-Mens-Casual-Shoes-Spring-Leather__46717.1545973953.jpg?c=2?imbypass=on', category: 'clothing', subcategory: 'men', inStock: false, rating: 4.7, brand: 'Adidas' },
    { id: '6', name: 'Women\'s Maxi Dress', description: 'Maxi Dress for women', price: 1600, imageUrl: 'https://i.pinimg.com/originals/74/99/c6/7499c6f7320c7a1a86572bf613e9b5ae.jpg', category: 'clothing', subcategory: 'women', inStock: true, rating: 4.9, brand: 'MadeInIndia' },
    { id: '7', name: 'Women\'s Jeans', description: 'Stylish Jeans for women', price: 2150, imageUrl: 'https://tse2.mm.bing.net/th/id/OIP.Iecf_hc1-r2gV1bTrPh8xwHaLH?cb=ucfimgc2&rs=1&pid=ImgDetMain&o=7&rm=3', category: 'clothing', subcategory: 'women', inStock: true, rating: 4.9, brand: 'Levis' },
    { id: '8', name: 'Men\'s Jacket', description: 'stylish Jacket for men', price: 3400, imageUrl: 'https://5.imimg.com/data5/EY/RC/MY-43636851/men-s-stylish-jacket-in-washing-stuff-500x500.jpg', category: 'clothing', subcategory: 'men', inStock: false, rating: 4.7, brand: 'H&M' },
    { id: '9', name: 'Women\'s Saree', description: 'Party Wear Saree for women', price: 4500, imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.rixiumjUrTqbTMUNC1sp4wHaLH?cb=ucfimgc2&rs=1&pid=ImgDetMain&o=7&rm=3', category: 'clothing', subcategory: 'women', inStock: true, rating: 4.9, brand: 'MadeInIndia' },
    { id: '10', name: 'Men\'s Blazer', description: 'stylish Blazer for men', price: 5600, imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.K7LFKhiOZhEKuLj478OLqAHaJh?cb=ucfimgc2&rs=1&pid=ImgDetMain&o=7&rm=3', category: 'clothing', subcategory: 'men', inStock: false, rating: 4.7, brand: 'Raymond' },
    { id: '11', name: 'Women\'s Handbag', description: 'Stylish handbag for women', price: 850, imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.0bgCHmKkeR0ZU302rxDddwHaHa?cb=ucfimgc2&rs=1&pid=ImgDetMain&o=7&rm=3', category: 'clothing', subcategory: 'women', inStock: true, rating: 4.6, brand: 'Gucci' },
    { id: '12', name: 'Men\'s Trouser', description: 'stylish Trouser for men', price: 1400, imageUrl: 'https://tse1.mm.bing.net/th/id/OIP._7rCADj9ux3C2CvGUF0htQHaJu?cb=ucfimgc2&rs=1&pid=ImgDetMain&o=7&rm=3', category: 'clothing', subcategory: 'men', inStock: false, rating: 4.9, brand: 'USB' },
    // Kids Wear
    { id: '13', name: 'Kids Casual T-shirt', description: 'Comfortable cotton t-shirt for kids', price: 850, imageUrl: 'https://5.imimg.com/data5/AL/SR/MY-6233323/kids-casual-t-shirt-500x500.jpg', category: 'clothing', subcategory: 'kids', inStock: true, rating: 4.6, brand: 'Adidas' },
    { id: '14', name: 'Kids Jeans', description: 'Durable jeans for active kids', price: 1100, imageUrl: 'https://tse1.mm.bing.net/th/id/OIP.q8ec2xnAaeOPCQK2hLMEKQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', category: 'clothing', subcategory: 'kids', inStock: true, rating: 4.8, brand: 'Burberry' },
    { id: '15', name: 'Kids Party Dress', description: 'Elegant party dress for kids', price: 2350, imageUrl: 'https://i5.walmartimages.com/seo/Christmas-Wedding-Guest-Dresses-for-Girls-Pink-Flowers-Little-Tulle-Lace-Party-Dress-Kids-Formal-Birthday-Princess-Pageant-Prom-Maxi-Gown_7ab44305-533f-40e3-9cd9-03b8f5a6d22f.704d2bd980b81cee95fbf5e314dff26e.jpeg', category: 'clothing', subcategory: 'kids', inStock: true, rating: 4.8, brand: 'MadeInIndia' },
    // Beauty Products
    { id: '16', name: 'Facial Cleanser', description: 'Gentle facial cleanser for all skin types', price: 350, imageUrl: 'https://i5.walmartimages.com/asr/f06729fd-f7ca-4535-912f-f8a147f15101.d1b193b0cfa0379280a8d4ee80378cc3.jpeg', category: 'beauty', inStock: true, rating: 4.7, brand: 'Foxtale' },
    { id: '17', name: 'Moisturizing Cream', description: 'Hydrating face cream for daily use', price: 560, imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_56106994-d5ee-42f3-a199-dc922330ea00?wid=488&hei=488&fmt=pjpeg', category: 'beauty', inStock: true, rating: 4.5, brand: 'Olay' },
    { id: '18', name: 'Lipstick Set', description: 'Set of 5 matte lipsticks in different shades', price: 800, imageUrl: 'https://images-cdn.ubuy.co.in/633ff73ad40de3563b303b9e-6-colors-of-velvet-smooth-matte-lipstick.jpg', category: 'beauty', inStock: true, rating: 4.6, brand: 'Lakme' },
    // Accessories
    { id: '19', name: 'Leather Wallet', description: 'Premium leather wallet with multiple card slots', price: 1000, imageUrl: 'https://i.etsystatic.com/15615725/r/il/a1f930/2289085880/il_fullxfull.2289085880_aqlo.jpg', category: 'accessories', inStock: true, rating: 4.4, brand: 'Gucci' },
    { id: '20', name: 'Sunglasses', description: 'UV protection sunglasses with polarized lenses', price: 2100, imageUrl: 'https://static.vecteezy.com/system/resources/previews/022/330/010/non_2x/sunglasses-on-a-tropical-beach-and-sea-summer-festive-background-generative-ai-free-photo.jpeg', category: 'accessories', inStock: true, rating: 4.7, brand: 'Rayban' },
    { id: '21', name: 'Watch', description: 'Elegant wristwatch with leather strap', price: 4200, imageUrl: 'https://tse1.mm.bing.net/th/id/OIP.hlhC0L07E6Zfiek0L_kcAAHaFj?rs=1&pid=ImgDetMain&o=7&rm=3', category: 'accessories', inStock: true, rating: 4.8, brand: 'Titan' }
  ];

  constructor(private http: HttpClient) { }

  // Update product rating
  updateProductRating(productId: string, rating: number): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${productId}/rating`, { rating });
  }

  // Merge backend + local products, avoiding duplicates
  getAllProducts(): Observable<Product[]> {
  return forkJoin([
    this.http.get<Product[]>(this.apiUrl).pipe(
      catchError(err => {
        console.error('Error fetching backend products, using empty array', err);
        return of([]);
      }),
      map(backendProducts => 
        backendProducts.map(p => ({ ...p, id: p.id ?? p._id })) // <-- normalize ID here
      )
    ),
    of(this.localProducts)
  ]).pipe(
    map(([backendProducts, localProducts]) => {
      const allProductsMap = new Map<string, Product>();
      backendProducts.forEach(p => allProductsMap.set(p.id, p));
      localProducts.forEach(p => { 
        if (!allProductsMap.has(p.id)) allProductsMap.set(p.id, p); 
      });
      return Array.from(allProductsMap.values());
    })
  );
}

  getProductById(id: string): Observable<Product | undefined> {
    return this.getAllProducts().pipe(
      map(products => products.find(p => p.id === id))
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.getAllProducts().pipe(
      map(products => products.filter(p => p.category === category))
    );
  }

  getProductsByCategoryAndSubcategory(category: string, subcategory: string): Observable<Product[]> {
    return this.getAllProducts().pipe(
      map(products => products.filter(p => p.category === category && p.subcategory === subcategory))
    );
  }

  getProductsBySubcategory(subcategory: string): Observable<Product[]> {
    return this.getAllProducts().pipe(
      map(products => products.filter(p => p.subcategory === subcategory))
    );
  }
}