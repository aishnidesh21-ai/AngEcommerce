import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  loading = true;
  error = false;

  // Hero carousel
  heroImages: string[] = [
    'https://img.freepik.com/premium-photo/background-image-elegant-clothing-boutique-interior-with-clothes-accessories-display-copy-space_236854-52930.jpg?w=2000',
    'https://tse3.mm.bing.net/th/id/OIP.nuMKiEc9i_ZSeug0TnraIwAAAA?cb=ucfimgc2&rs=1&pid=ImgDetMain&o=7&rm=3',
    'https://media.timeout.com/images/100620009/1920/1080/image.jpg'
  ];
  currentHero = 0;

  // Trusted brands
  brands = [
  { name: 'Nike', logo: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/5b336946374723.5607cfe0dfc17.png' },
  { name: 'Adidas', logo: 'https://www.kindpng.com/picc/m/311-3111955_adidas-logo-transparent-background-hd-png-download.png' },
  { name: 'Puma', logo: 'https://tse2.mm.bing.net/th/id/OIP.r7QKBH_aGvjc0D-2gi__KgHaFt?rs=1&pid=ImgDetMain&o=7&rm=3' },
  { name: 'Levis', logo: 'https://static.vecteezy.com/system/resources/previews/023/871/690/non_2x/levis-brand-logo-symbol-design-clothes-fashion-illustration-with-black-background-free-vector.jpg' },
  { name: 'Zara', logo: 'https://tse1.mm.bing.net/th/id/OIP.POiJTKMHmo2ifedEOD4vXgHaEM?rs=1&pid=ImgDetMain&o=7&rm=3' },
  { name: 'H&M', logo: 'https://thumbs.dreamstime.com/z/h-m-logo-70399301.jpg' },
  { name: 'UCB', logo: 'https://i.pinimg.com/originals/17/7d/71/177d71a99ec821b387e884dee5f59455.gif' },
  { name: 'Gucci', logo: 'https://i.pinimg.com/474x/92/13/07/921307f15d3825afed9ff7d642ac5f59.jpg' },
  { name: 'Louis Vuitton', logo: 'https://wallpapercave.com/wp/wp7518491.jpg' },
  { name: 'Calvin Klein', logo: 'https://dja.dj/wp-content/uploads/2020/10/dja-calvinklein-2010-women-fragrance-beauty-branding-logodesign-01.jpg' },

  { name: 'Nike', logo: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/5b336946374723.5607cfe0dfc17.png' },
  { name: 'Adidas', logo: 'https://www.kindpng.com/picc/m/311-3111955_adidas-logo-transparent-background-hd-png-download.png' },
  { name: 'Puma', logo: 'https://tse2.mm.bing.net/th/id/OIP.r7QKBH_aGvjc0D-2gi__KgHaFt?rs=1&pid=ImgDetMain&o=7&rm=3' },
  { name: 'Levis', logo: 'https://static.vecteezy.com/system/resources/previews/023/871/690/non_2x/levis-brand-logo-symbol-design-clothes-fashion-illustration-with-black-background-free-vector.jpg' },
  { name: 'Zara', logo: 'https://tse1.mm.bing.net/th/id/OIP.POiJTKMHmo2ifedEOD4vXgHaEM?rs=1&pid=ImgDetMain&o=7&rm=3' },
  { name: 'H&M', logo: 'https://thumbs.dreamstime.com/z/h-m-logo-70399301.jpg' },
  { name: 'UCB', logo: 'https://i.pinimg.com/originals/17/7d/71/177d71a99ec821b387e884dee5f59455.gif' },
  { name: 'Gucci', logo: 'https://i.pinimg.com/474x/92/13/07/921307f15d3825afed9ff7d642ac5f59.jpg' },
  { name: 'Louis Vuitton', logo: 'https://wallpapercave.com/wp/wp7518491.jpg' },
  { name: 'Calvin Klein', logo: 'https://dja.dj/wp-content/uploads/2020/10/dja-calvinklein-2010-women-fragrance-beauty-branding-logodesign-01.jpg' }

];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadFeaturedProducts();
    this.startHeroCarousel();
  }

  loadFeaturedProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.featuredProducts = products
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 6);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  startHeroCarousel(): void {
    setInterval(() => {
      this.currentHero = (this.currentHero + 1) % this.heroImages.length;
    }, 4000); // change every 4 seconds
  }
}
