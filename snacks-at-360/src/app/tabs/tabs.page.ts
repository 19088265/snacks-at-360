import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  //cartItemCount: number | undefined;
  cartItemCount$: Observable<number>;

  constructor(private cartService: CartService) {
    // this.cartService.getCartItemCount().subscribe(count => {
    //   this.cartItemCount = count;
    // });
    this.cartItemCount$ = this.cartService.getCartItemCount();
  }
}
