import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from 'src/app/models/product';
import { Order } from 'src/app/models/order';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { catchError, concatMap, map, toArray } from 'rxjs/operators';
import { forkJoin, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Timestamp } from 'firebase/firestore';

interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  //private cart = new BehaviorSubject<{ [productId: string]: number }>({});
  private cart = new BehaviorSubject<{ [productId: string]: CartItem }>({});
  private itemCount = new BehaviorSubject<number>(0);


  constructor(private firestore: AngularFirestore) {}

  // Observable to track cart changes
  // getCart(): Observable<{ [productId: string]: number }> {
  //   return this.cart.asObservable();
  // }

  // getCartItemCount() {
  //   return this.itemCount.asObservable();
  // }

  getCartItemCount(): Observable<number> {
    return this.itemCount.asObservable();
  }

  getCart(): Observable<{ [productId: string]: CartItem }> {
    return this.cart.asObservable();
  }

  // Add a product to the cart
  addToCart(product: Product, quantity: number): void {
    const currentCart = this.cart.value;
    if (currentCart[product.id]) {
        currentCart[product.id].quantity += quantity;
    } else {
        currentCart[product.id] = {
            name: product.name,
            price: product.price,  // Assuming price is part of the Product model
            quantity: quantity
        };
    }
    this.cart.next(currentCart);
    this.itemCount.next(this.itemCount.value + 1);
  }

  // Remove a product from the cart
  // removeFromCart(productId: string): void {
  //   const currentCart = this.cart.value;
  //   delete currentCart[productId];
  //   this.cart.next(currentCart);
  //   this.itemCount.next(this.itemCount.value - 1);
  // }

  removeFromCart(productId: string): void {
    const currentCart = this.cart.value; // Assuming this is a dictionary of products

    if (currentCart[productId]) {
        if (currentCart[productId].quantity > 1) {
            // Decrement the quantity by one if more than one exists
            currentCart[productId].quantity -= 1;
        } else {
            // If only one item left, delete it from the cart
            delete currentCart[productId];
        }

        // Update the cart observable with the modified cart
        this.cart.next(currentCart);

        // Decrement the overall item count in the cart
        this.itemCount.next(this.itemCount.value - 1);
    } else {
        console.error('Attempted to remove a product that does not exist in the cart');
    }
}


  // Clear the entire cart
  clearCart(): void {
    this.cart.next({});
  }

  getCartSnapshot(): { [productId: string]: CartItem } {
    return this.cart.value;
  }

  // placeOrder(userId: string): Promise<void> {
  //   const products = this.getCartSnapshot();
  //   const order: Order = {
  //     orderId: this.firestore.createId(),
  //     userId: userId,
  //     products: Object.keys(products).map(productId => ({ productId, quantity: products[productId] })),
  //     total: 0, // Calculate total price if prices are stored/stated somewhere
  //     date: new Date()
  //   };

  //   return this.firestore.collection('orders').doc(order.orderId).set(order).then(() => {
  //     this.clearCart(); // Clear the cart after placing the order
  //   });
  // }

  placeOrder(userId: string): Promise<void> {
    const products = this.getCartSnapshot();
    const order: Order = {
      orderId: this.firestore.createId(), // Generate a unique order ID
      userId: userId,
      products: Object.keys(products).map(productId => ({
        productId: productId,
        productName: products[productId].name,
        productPrice: products[productId].price,
        quantity: products[productId].quantity
      })),
      total: Object.values(products).reduce((total, item) => total + (item.price * item.quantity), 0), // Calculate total price
      date: new Date() // Current date and time
      //date: new Date(2024, 1, 10, 12, 0)
    };

    // Save the order to Firestore and clear the cart afterwards
    return this.firestore.collection('orders').doc(order.orderId).set(order).then(() => {
      this.clearCart(); // Clear the cart after placing the order
    });
}

  getUserOrders(userId: string): Observable<Order[]> {
    return this.firestore.collection<Order>('orders', ref => ref.where('userId', '==', userId)).valueChanges().pipe(
      map(orders => orders.map(order => ({
        ...order,
        date: (order.date as any).toDate()
      })))

    );
  }

  getProductById(id: string): Observable<Product | undefined> {
    return this.firestore.collection<Product>('product').doc(id).valueChanges().pipe(
      map(product => {
        if (product) {
          //return { id, ...product };  // Ensure that 'id' is included properly
        }
        return undefined;
      })
    );
  }

  getProductById2(id: string): Observable<Product | undefined> {
    return this.firestore.collection<Product>('product').doc(id).valueChanges({ idField: 'id' }).pipe(
      map(product => {
        return product; // Now 'product' includes 'id' automatically set to the document ID
      })
    );
  }

  getProductById3(id: string): Observable<any> {
    return this.firestore.collection('product').doc(id).valueChanges();
  }

  // getOrderItems(id: string): Observable<Product[]> {
  //   return this.firestore.collection<Product>('Product', ref => ref.where('id', '==', id)).valueChanges();
  // }

  getProductsForUserOrders(userId: string): Observable<Product[]> {
    return this.getUserOrders(userId).pipe(
      concatMap(orders => from(orders)), // Stream each order
      mergeMap(order =>
        from(order.products).pipe(
          mergeMap(item =>
            this.firestore.collection('product').doc<Product>(item.productId).valueChanges().pipe(
              map(product => ({
                id: product?.id ?? 'default-id',
                name: product?.name ?? 'Unnamed Product',
                price: product?.price ?? 0,
                quantity: item.quantity,
                description: product?.description ?? 'No description available'
              })),
              catchError(err => { throw new Error(`Failed to fetch product details: ${err.message}`); })
            )
          ),
          toArray() // Aggregate products into a single array per order
        )
      ),
      toArray(), // Collect arrays from each order
      map(productArrays => productArrays.flat()) // Flatten the arrays into one array
    );
  }

  // makeOrder(userId: string): Observable<any> {
  //   const cart = this.getCartSnapshot();
  //   const ids = Object.keys(cart);

  //   return forkJoin(
  //     ids.map(id =>
  //       this.getProductById(id).pipe(
  //         map(product => ({
  //           id,  // Use 'id' instead of 'productId'
  //           name: product?.name,
  //           description: product?.description,
  //           price: product?.price,
  //           quantity: cart[id]
  //         }))
  //       )
  //     )
  //   ).pipe(
  //     mergeMap(products => {
  //       const order = {
  //         orderId: this.firestore.createId(),
  //         userId: userId,
  //         products: products,
  //         total: products.reduce((acc, prod) => acc + (prod?.price || 0) * prod.quantity, 0),
  //         date: new Date()
  //       };
  //       return from(this.firestore.collection('orders').doc(order.orderId).set(order));
  //     })
  //   );
  // }

}
