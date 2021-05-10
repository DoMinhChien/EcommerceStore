import { Component, OnInit } from '@angular/core';
import { AccountService } from './account/account.service';
import { BasketService } from './basket/basket.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'E-commerce';
  constructor(private basketSrv: BasketService, private accountService: AccountService) {
  }
  ngOnInit(): void {
  this.loadBasket();
  this.loadCurrentUser();
  }
  // tslint:disable-next-line:typedef
  loadCurrentUser() {
    const token = localStorage.getItem('token');
    if (token){
      this.accountService.loadCurrentUser(token).subscribe(() => {
      console.log('loaded');
      }, error => {
        console.log(error);
      });
    }
  }
  loadBasket(): void{
    const basketId = localStorage.getItem('basket_id');
    if (basketId){
      this.basketSrv.getBasket(basketId).subscribe(() => {
        console.log('success');
      }, error => {
        console.log(error);
      });
    }
  }
}
