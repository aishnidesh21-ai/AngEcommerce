import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSnackBarModule
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartTotal = 0;
  isSubmitting = false;
  orderPlaced = false;

  paymentMethods = [
    { id: 'credit', name: 'Credit Card' },
    { id: 'debit', name: 'Debit Card' },
    { id: 'paypal', name: 'PayPal' },
    { id: 'cod', name: 'Cash on Delivery' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.checkoutForm = this.formBuilder.group({
      personalInfo: this.formBuilder.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required]]
      }),
      shippingAddress: this.formBuilder.group({
        street: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        zipCode: ['', [Validators.required]],
        country: ['', [Validators.required]]
      }),
      paymentMethod: ['credit', [Validators.required]],
      cardInfo: this.formBuilder.group({
        cardNumber: [''],
        nameOnCard: [''],
        expiryDate: [''],
        cvv: ['']
      })
    });
  }

  ngOnInit(): void {
    // Update cart total
    this.cartService.getCartTotal().subscribe(total => this.cartTotal = total);

    // Watch payment method changes
    this.paymentMethod?.valueChanges.subscribe(method => {
      if (method === 'credit' || method === 'debit') {
        // Add validators
        this.cardInfo?.get('cardNumber')?.setValidators([Validators.required]);
        this.cardInfo?.get('nameOnCard')?.setValidators([Validators.required]);
        this.cardInfo?.get('expiryDate')?.setValidators([Validators.required]);
        this.cardInfo?.get('cvv')?.setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(4)]);
      } else {
        // Clear validators for PayPal or COD
        this.cardInfo?.get('cardNumber')?.clearValidators();
        this.cardInfo?.get('nameOnCard')?.clearValidators();
        this.cardInfo?.get('expiryDate')?.clearValidators();
        this.cardInfo?.get('cvv')?.clearValidators();
      }
      this.cardInfo?.updateValueAndValidity();
    });
  }

  get personalInfo() { return this.checkoutForm.get('personalInfo'); }
  get shippingAddress() { return this.checkoutForm.get('shippingAddress'); }
  get paymentMethod() { return this.checkoutForm.get('paymentMethod'); }
  get cardInfo() { return this.checkoutForm.get('cardInfo'); }

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      this.markFormGroupTouched(this.checkoutForm);
      return;
    }

    this.isSubmitting = true;

    // Simulate order processing
    setTimeout(() => {
      this.orderPlaced = true;
      this.cartService.clearCart();
      this.isSubmitting = false;

      // Show success snackbar
      this.snackBar.open('✅ Order placed successfully!', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }, 2000);
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as FormGroup).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  backToCart(): void {
    this.router.navigate(['/cart']);
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }
}
