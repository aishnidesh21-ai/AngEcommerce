import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Angular Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Services
import { ProductService } from './services/product.service';
import { CartService } from './services/cart.service';

// 👇 Locale imports
import { registerLocaleData } from '@angular/common';
import localeIn from '@angular/common/locales/en-IN';

// Register Indian locale
registerLocaleData(localeIn, 'en-IN');

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BrowserAnimationsModule,
    // Angular Material
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  providers: [
    ProductService,
    CartService,
    { provide: LOCALE_ID, useValue: 'en-IN' }   // 👈 Default locale INR
  ],
  bootstrap: []
})
export class AppModule {}
