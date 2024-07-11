import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { filter, first } from 'rxjs/operators';
import { forkJoin, Observable, of } from 'rxjs';
import { Order } from 'src/app/models/order';
import { switchMap, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../models/product';
import {ChangeDetectionStrategy, signal} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Timestamp } from 'firebase/firestore';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit {

  readonly panelOpenState = signal(false);

  pastOrders$: Observable<Order[]> | undefined;

  order: Order | undefined; // Assuming you have some way to get the current order
  productsDetails$: Observable<any[]> | undefined;
  product: any;
  products: Product[] = [];
  totalAllOrders$: Observable<number> | undefined;
  ordersByMonth$: Observable<{ month: string, orders: Order[], total: number }[]> | undefined;

  constructor(private cartService: CartService, private authService: AuthService, private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  ngOnInit() {
    this.authService.getCurrentUserId().subscribe(userId => {
      if (userId) {
        //this.pastOrders$ = this.cartService.getUserOrders(userId);
        //console.log("This user is " + userId);
        this.ordersByMonth$ = this.cartService.getUserOrders(userId).pipe(
          map(orders => this.groupAndFillOrdersByMonth(orders))
        );
      }
    });



    //this.pastOrders$ = this.cartService.getPastOrders(); // Assuming this method fetches the past orders
    // this.totalAllOrders$ = this.pastOrders$?.pipe(
    //   map(orders => orders.reduce((acc, order) => acc + order.total, 0))
    // );


    this.totalAllOrders$ = this.getTotalSum();

  }

  private groupAndFillOrdersByMonth(orders: Order[]): { month: string, orders: Order[], total: number }[] {
    const months = this.generateMonthArray();
    const ordersByMonth = orders.reduce((acc, order) => {
      const monthKey = new Date(order.date).toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!acc[monthKey]) {
        acc[monthKey] = { orders: [], total: 0 };
      }
      acc[monthKey].orders.push(order);
      acc[monthKey].total += order.total;
      return acc;
    }, {} as Record<string, { orders: Order[], total: number }>);

    // Sort each month's orders by date after converting to Date object
  for (const month of Object.keys(ordersByMonth)) {
    ordersByMonth[month].orders.sort((a, b) => {
      const dateA = a.date instanceof Date ? a.date : new Date(a.date); // Convert if not already a Date
      const dateB = b.date instanceof Date ? b.date : new Date(b.date); // Convert if not already a Date
      return dateA.getTime() - dateB.getTime();
    });
  }

    return months.map(month => ({
      month,
      orders: ordersByMonth[month]?.orders || [],
      total: ordersByMonth[month]?.total || 0
    }));
  }

  private generateMonthArray(): string[] {
    const year = new Date().getFullYear(); // Use the current year or a specific year
    return Array.from({ length: 12 }, (_, i) => new Date(year, i).toLocaleString('default', { month: 'long', year: 'numeric' }));
  }

  private getTotalSum(): Observable<number> {
    return this.pastOrders$ ? this.pastOrders$.pipe(
      filter(orders => !!orders), // Ensure that orders is not undefined
      map(orders => orders.reduce((acc, order) => acc + (order.total ?? 0), 0))
    ) : of(0); // Return an Observable of 0 if pastOrders$ is undefined
  }

  // placeOrder() {
  //   this.authService.getCurrentUserId().pipe(first()).subscribe(userId => {
  //     if (userId) {
  //       this.cartService.placeOrder(userId).then(() => {
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

  // placeOrder2() {
  //   this.authService.getCurrentUserId().pipe(
  //     first(),
  //     switchMap(userId => {
  //       if (userId) {
  //         return this.cartService.makeOrder(userId);
  //       } else {
  //         throw new Error('No user logged in');
  //       }
  //     })
  //   ).subscribe({
  //     next: () => {
  //       console.log('Order placed successfully');
  //       // Handle navigation or clearing up after order
  //     },
  //     error: (error) => {
  //       console.error('Failed to place order:', error);
  //     }
  //   });
  // }

}
