import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage  {

  product: Product = {
    id: '',  // ID is generally set when creating the entry in Firestore
    name: '',
    price: 0,
    quantity: 0,
    description: 'Snack'
  };

  constructor(private dataService: DataService, private router: Router, private _snackBar: MatSnackBar) {}

  // addProduct() {
  //   if (this.product.name && this.product.price && this.product.quantity && this.product.description) {
  //     this.dataService.addProduct(this.product).then(() => {
  //       console.log('Product added successfully!');
  //       this._snackBar.open('New item added successfully', 'Close', {
  //         duration: 3000
  //       });
  //       // Reset the form or navigate away
  //       this.product = { id: '', name: '', price: 0, quantity: 0, description: '' };
  //       this.router.navigate(['/tabs']);

  //     }).catch(error => {
  //       this._snackBar.open('Oh snap! Try adding the item again.', 'Close', {
  //         duration: 3000
  //       });
  //       console.error('Error adding product: ', error);
  //     });
  //   }
  // }

  addProduct() {
    // Check if any of the required fields is empty
    if (!this.product.name || !this.product.price || !this.product.quantity || !this.product.description) {
      this._snackBar.open('Oh snap! Please fill in all the fields', 'Close', {
        duration: 3000
      });
      return; // Stop execution if any field is empty
    }

    // Proceed if all fields are filled
    this.dataService.addProduct(this.product).then(() => {
      console.log('Product added successfully!');
      this._snackBar.open('New item added successfully', 'Close', {
        duration: 3000
      });
      // Reset the form or navigate away
      this.product = { id: '', name: '', price: 0, quantity: 0, description: '' };
      this.router.navigate(['/tabs']);
    }).catch(error => {
      this._snackBar.open('Oh snap! Try adding the item again.', 'Close', {
        duration: 3000
      });
      console.error('Error adding product: ', error);
    });
  }



}
