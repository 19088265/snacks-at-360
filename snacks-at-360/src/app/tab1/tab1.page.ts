import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Product } from 'src/app/models/product';
import { CartService } from '../services/cart.service';
import { AuthService } from 'src/app//services/auth.service';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { WelcomeDialogPage } from '../dialogs/welcome-dialog/welcome-dialog.page';
import { switchMap, Observable, first } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  products: Product[] = [];
  cart: { [productId: string]: number } = {};  // Tracks product IDs and quantities
  isModalOpen:boolean = false;
  username: string | null = null;

  constructor(private dataService: DataService, private cartService: CartService, private authService: AuthService,
    private router: Router, private _snackBar: MatSnackBar, public dialog: MatDialog) {}

  ngOnInit() {
    this.dataService.getProducts().subscribe((products) => {
      this.products = products;
    });
    //this.openWelcomeDialog();
    this.isModalOpen = true;

    this.authService.getCurrentUserId().pipe(
      switchMap(userId => {
        if (userId) {
          return this.authService.getUserByUserId(userId);
        } else {
          return new Observable<any>();
        }
      }),
      first() // Take the first value and complete
    ).subscribe(user => {
      this.username = user?.username || 'there';
    });
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  openWelcomeDialog(): void {
    this.dialog.open(WelcomeDialogPage, {
      width: '80%',
      data: { }
    });
  }

  addToCart(product: Product, quantity: number) {
    if (this.cart[product.id]) {
      this.cart[product.id] += 1;
    } else {
      //this.cart[product.id] = quantity;
    }
    this.cartService.addToCart(product, quantity);
    console.log('Cart:', this.cart);
  }

  signout() {

    //Clear cache
    localStorage.clear();
    sessionStorage.clear();

    this.authService.signOut().then(res => {
      console.log('Successfully signed out with Google!', res);
      //localStorage.clear();
      this._snackBar.open('You logged out. Have a nice day', 'Sure', {
        duration: 3000
      });
      this.router.navigate(['/login']);
      // Handle successful sign-in here (navigate or load user data, etc.)
    }).catch(error => {
      console.error('Failed to sign out with Google', error);
    });
  }

}
