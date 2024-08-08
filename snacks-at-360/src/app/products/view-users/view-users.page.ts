import { Component, OnInit, signal } from '@angular/core';
import { Product } from 'src/app/models/product';
import { AuthService } from 'src/app//services/auth.service';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { CartService } from 'src/app/services/cart.service';
import { filter, first, map, Observable, of } from 'rxjs';
import { User } from 'src/app/models/user';
import { Order } from 'src/app/models/order';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.page.html',
  styleUrls: ['./view-users.page.scss'],
})
export class ViewUsersPage implements OnInit {

  userName$: Observable<string | null> | undefined;

  readonly panelOpenState = signal(false);

  pastOrders$: Observable<Order[]> | undefined;

  order: Order | undefined; // Assuming you have some way to get the current order
  productsDetails$: Observable<any[]> | undefined;
  product: any;
  products: Product[] = [];
  totalAllOrders$: Observable<number> | undefined;
  ordersByMonth$: Observable<{ month: string, orders: Order[], total: number, username: string, email: string, }[]> | undefined;
  ordersByMonth2$: Observable<{ userId: string, username: string, month: string, orders: Order[], total: number }[]> | undefined;

  //userIds: string[] = ['rHtBzkcxO1dx5wHyGKGyPqzwnh42', 'lZ73oFEiPEN3iJFcdf0vIYjsFBF3', '33w4rtjafyMYLj9mSvt47Z39uy43'];
  userIds: string[] = [];
  //userIdsFromDatabase: string[] = [];
  userIdsFromDatabase$: Observable<string[]> | undefined;
  private userId: string = 'rHtBzkcxO1dx5wHyGKGyPqzwnh42';
  orderByMonth$: Observable<any[]>[] = [];

  users$: Observable<any[]> | undefined;

  constructor(private dataService: DataService, private cartService: CartService, private authService: AuthService,
    private router: Router, private _snackBar: MatSnackBar) {}

    openSnackBar(message: string, action: string) {
      this._snackBar.open(message, action);
    }

    ngOnInit() {

      this.userName$ = this.authService.getCurrentUserEmail();
      //console.log('Current user ' + this.userName$)

      //fetch orders of one user
      // this.authService.getCurrentUserId().subscribe(userId => {
      //   if (userId) {
      //     //this.pastOrders$ = this.cartService.getUserOrders(userId);
      //     //console.log("This user is " + userId);
      //     this.ordersByMonth$ = this.cartService.getUserOrders(userId).pipe(
      //       map(orders => this.groupAndFillOrdersByMonth(orders))
      //     );
      //   }
      // });

      //fetch and store all user ids
      this.authService.getAllUserIds()
        .pipe(first()) // You can use take(1) as well
        .subscribe(ids => {
          this.userIds = ids;
          //console.log('User IDs:', this.userIds);
        });

      //fetch orders of all users
      this.authService.getAllUserIds().subscribe(userId => {
        if (userId) {
          this.userIds.forEach(userId => {
            const orders$ = this.cartService.getUserOrders(userId).pipe(
              map(orders => this.groupAndFillOrdersByMonth(orders))
            );
            this.orderByMonth$?.push(orders$);
          });
        }
      });

      this.totalAllOrders$ = this.getTotalSum();

      this.authService.getAllUsers().subscribe(users => {
        users.forEach(user => {
          //console.log('Username:' + user.username + ' Id:' + user.id + ' Email:' + user.email + ' Role:' + user.role);
        });
      });


    }

    ////////////////////////functions//////////////////////////////

    private getTotalSum(): Observable<number> {
      return this.pastOrders$ ? this.pastOrders$.pipe(
        filter(orders => !!orders), // Ensure that orders is not undefined
        map(orders => orders.reduce((acc, order) => acc + (order.total ?? 0), 0))
      ) : of(0); // Return an Observable of 0 if pastOrders$ is undefined
    }

    private groupAndFillOrdersByMonth(orders: Order[]): { month: string, orders: Order[], total: number, username: string, email: string }[] {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
      const lastMonth = lastMonthDate.getMonth();
      const lastMonthYear = lastMonthDate.getFullYear();

      const filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.date);
        const orderMonth = orderDate.getMonth();
        const orderYear = orderDate.getFullYear();

        // Check if order is from the current month or last month
        return (orderMonth === currentMonth && orderYear === currentYear) ||
               (orderMonth === lastMonth && orderYear === lastMonthYear);
      });

      const groupedOrders = filteredOrders.reduce((acc, order) => {
        const monthKey = new Date(order.date).toLocaleString('default', { month: 'short', year: 'numeric' });
        if (!acc[monthKey]) {
          acc[monthKey] = { orders: [], total: 0, username: order.username, email: order.email };
        }
        acc[monthKey].orders.push(order);
        acc[monthKey].total += order.total;
        return acc;
      }, {} as Record<string, { orders: Order[], total: number, username: string, email: string }>);

      // Sort each month's orders by date after converting to Date object
      for (const month of Object.keys(groupedOrders)) {
        groupedOrders[month].orders.sort((a, b) => {
          const dateA = a.date instanceof Date ? a.date : new Date(a.date); // Convert if not already a Date
          const dateB = b.date instanceof Date ? b.date : new Date(b.date); // Convert if not already a Date
          return dateA.getTime() - dateB.getTime();
        });
      }

      return Object.entries(groupedOrders).map(([month, data]) => ({
        month,
        orders: data.orders,
        total: data.total,
        username: data.username,
        email: data.email
      }));
    }


  }
