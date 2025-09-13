import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  // Company information
  companyInfo = {
    name: 'ShopEase',
    founded: 2018,
    mission: 'To provide high-quality products at affordable prices with exceptional customer service.',
    vision: 'To become the most trusted and preferred online shopping destination worldwide.'
  };

  // Team members
  teamMembers = [
    {
      name: 'Aishwarya',
      position: 'CEO & Founder',
      bio: 'John founded ShopSmart with a vision to revolutionize online shopping. With over 15 years of experience in e-commerce, he leads our company towards continuous innovation.'
    },
    {
      name: 'Himanshi',
      position: 'Chief Operations Officer',
      bio: 'Sarah oversees all operational aspects of ShopSmart, ensuring smooth delivery and customer satisfaction. Her background in supply chain management has been instrumental in our growth.'
    },
    {
      name: 'Mandar',
      position: 'Chief Technology Officer',
      bio: 'Michael leads our tech team in developing cutting-edge solutions for our e-commerce platform. His expertise in web technologies keeps ShopSmart at the forefront of innovation.'
    }
  ];

  // Company values
  values = [
    {
      title: 'Customer First',
      description: 'We prioritize our customers in every decision we make, striving to exceed their expectations.',
      icon: 'people'
    },
    {
      title: 'Quality',
      description: 'We are committed to offering only the highest quality products that meet our strict standards.',
      icon: 'verified'
    },
    {
      title: 'Innovation',
      description: 'We continuously seek new ways to improve our services and shopping experience.',
      icon: 'lightbulb'
    },
    {
      title: 'Integrity',
      description: 'We conduct our business with honesty, transparency, and ethical practices.',
      icon: 'handshake'
    }
  ];
}