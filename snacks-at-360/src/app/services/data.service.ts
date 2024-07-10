import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product';
import { Order } from 'src/app/models/order';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private firestore: AngularFirestore) {}

  getUsers(): Observable<User[]> {
    return this.firestore.collection<User>('users').valueChanges();
  }

  addProduct(product: Product): Promise<void> {
    const productId = this.firestore.createId(); // Generate a unique ID for the product
    return this.firestore.doc<Product>(`product/${productId}`).set({
      ...product,
      id: productId // Ensure the product object has an ID
    });
  }

  getProducts(): Observable<Product[]> {
    return this.firestore.collection<Product>('product').valueChanges();
  }

  placeOrder(order: Order) {
    return this.firestore.collection('orders').add(order);
  }
}
