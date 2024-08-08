import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { first } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import { Order } from 'src/app/models/order';
import { switchMap, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../models/product';
import {ChangeDetectionStrategy, signal} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSnackBar} from '@angular/material/snack-bar';
import { throwError } from 'rxjs';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  cart = this.cartService.getCart();
  cartTotal$: Observable<number> | undefined;

  constructor(private cartService: CartService,  private authService: AuthService, private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.cartTotal$ = this.cartService.getCart().pipe(
      map(cartItems => {
        return Object.values(cartItems).reduce((total, item) => total + (item.price * item.quantity), 0);
      }),
    );

    console.log("initial total is " + this.cartTotal$)
  }

  removeFromCart(productId: string) {
    this.cartService.removeFromCart(productId);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  // placeOrder() {
  //   this.authService.getCurrentUserId().pipe(first()).subscribe(userId => {
  //     if (userId) {
  //       this.cartService.placeOrder(userId).then(() => {
  //         this._snackBar.open('Transaction complete. Enjoy your day :)', 'Close', {
  //           duration: 4000
  //         });
  //         console.log('Order placed successfully');
  //         // Handle navigation or clearing up after order
  //       }).catch(error => {
  //         console.error('Failed to place order:', error);
  //       });
  //     } else {
  //       console.error('No user logged in');
  //     }
  //   });
  // }

  placeOrder() {
    this.cartService.getCart().pipe(
      first(),
      switchMap(cart => {
        // Check if the cart is empty
        if (!cart || Object.keys(cart).length === 0) {
          this._snackBar.open('Your cart is empty.', 'Close', {
            duration: 3000
          });
          return throwError(() => new Error('Cart is empty. Go grab a snack')); // Emit an error if the cart is empty
        }

        // Proceed if the cart is not empty
        return this.authService.getCurrentUserId().pipe(first());
      })
    ).subscribe({
      next: (userId) => {
        if (userId) {
          this.cartService.placeOrder(userId).then(() => {
            this._snackBar.open('Transaction complete. Enjoy your day :)', 'Close', {
              duration: 4000
            });
            console.log('Order placed successfully');
            window.location.reload();
            // Handle navigation or clearing up after order
          }).catch(error => {
            console.error('Failed to place order:', error);
          });
        } else {
          console.error('No user logged in');
          this._snackBar.open('You must be logged in to place an order.', 'Close', {
            duration: 3000
          });
        }
      },
      error: (error) => {
        console.error('Order placement error:', error);
        this._snackBar.open(error.message, 'Close', {
          duration: 3000
        });
      }
    });
  }


}
