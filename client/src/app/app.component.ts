import { Component, OnInit } from '@angular/core';
import { BasketService } from './basket/basket.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'E-commerce';
  constructor(private basketSrv: BasketService) {
  }
  ngOnInit(): void {
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
