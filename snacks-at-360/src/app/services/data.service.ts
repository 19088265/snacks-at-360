import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { combineLatest, forkJoin, Observable } from 'rxjs';
import { Product } from 'src/app/models/product';
import { Order } from 'src/app/models/order';
import { User } from 'src/app/models/user';
import { combineLatestAll, groupBy, map, mergeMap, toArray } from 'rxjs/operators';

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


  getUsersWithOrders(): Observable<any[]> {
    return this.firestore.collection<User>('users').valueChanges({ idField: 'uid' }).pipe(
      mergeMap(users => {
        if (users.length > 0) {
          return forkJoin(
            users.map(user =>
              this.firestore.collection<Order>('orders', ref => ref.where('userId', '==', user.uid))
                .valueChanges({ idField: 'orderId' })
                .pipe(
                  map(orders => ({
                    ...user,
                    orders: orders
                  }))
                )
            )
          );
        } else {
          return [];
        }
      })
    );
  }

  getAllOrders(): Observable<Order[]> {
    return this.firestore.collection<Order>('orders').valueChanges({ idField: 'orderId' }).pipe(
      map(orders => orders.map(order => ({
        ...order,
        // Convert Timestamp to Date object if necessary
        date: order.date ? order.date : order.date
      })))
    );
  }

}
