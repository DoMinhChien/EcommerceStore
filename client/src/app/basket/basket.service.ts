import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';
import { IProduct } from '../shared/models/product';
@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<IBasket>(null);
  basket$ = this.basketSource.asObservable();

  private basketTotalSource = new BehaviorSubject<IBasketTotals>(null);
  basketTotal$ = this.basketTotalSource.asObservable();
  shipping = 0;
  constructor(private httpClient: HttpClient) {

   }


   setShippingPrice(deliveryMethod: IDeliveryMethod) {
    this.shipping = deliveryMethod.price;
    const basket = this.getCurrentBasketValue();
    basket.deliveryMethodId = deliveryMethod.id;
    basket.shippingPrice = deliveryMethod.price;
    this.calculateTotals();
    this.setBasket(basket);
  }
 // tslint:disable-next-line:typedef
 getBasket(id: string) {
   return this.httpClient.get(this.baseUrl + 'Basket?id=' + id)
   .pipe(
     map((basket: IBasket) => {
       this.basketSource.next(basket);
       this.calculateTotals();
     })
   );

   }
   getCurrentBasketValue() {
    return this.basketSource.value;
  }
  private calculateTotals(): void {
    const basket = this.getCurrentBasket();
    const shipping = this.shipping;
    const subtotal = basket.items.reduce((a, b ) => (b.price * b.quantity) + a, 0);
    const total = subtotal + shipping;
    this.basketTotalSource.next({shipping, total, subtotal});
  }
   // tslint:disable-next-line:typedef
   setBasket(basket: IBasket){
     return this.httpClient.post(this.baseUrl + 'basket', basket).subscribe(
       (response: IBasket) => {
         this.basketSource.next(response);
         this.calculateTotals();
       });

   }
   getCurrentBasket(): IBasket{
     return this.basketSource.value;
   }
   addItemToBasket(item: IProduct, quantity = 1): void{
     const itemToAdd: IBasketItem = this.mapProductItemToBasket(item, quantity);
     const basket = this.getCurrentBasket() ?? this.createBasket();
     basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
     this.setBasket(basket);
   }

  addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
     const index = items.findIndex(i => i.id === itemToAdd.id);
     if (index === -1){
        itemToAdd.quantity = quantity;
        items.push(itemToAdd);
     }
     else{
       items[index].quantity += quantity;

     }
     return items;
  }
  mapProductItemToBasket(item: IProduct, quantity: number): any {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType
    };
  }
  private createBasket(): IBasket{
      const basket = new Basket();
      localStorage.setItem('basket_id', basket.id);

      return basket;
  }
  incrementItemQuantity(item: IBasketItem): void {
    const basket = this.getCurrentBasket();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    basket.items[foundItemIndex].quantity++;
    this.setBasket(basket);
  }

  decrementItemQuantity(item: IBasketItem): void  {
    const basket = this.getCurrentBasket();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    if (basket.items[foundItemIndex].quantity > 1) {
      basket.items[foundItemIndex].quantity--;
      this.setBasket(basket);
    } else {
      this.removeItemFromBasket(item);
    }
  }

  removeItemFromBasket(item: IBasketItem): void  {
    const basket = this.getCurrentBasket();
    if (basket.items.some(x => x.id === item.id)) {
      basket.items = basket.items.filter(i => i.id !== item.id);
      if (basket.items.length > 0) {
        this.setBasket(basket);
      } else {
        this.deleteBasket(basket);
      }
    }
  }
  // tslint:disable-next-line:typedef
  deleteBasket(basket: IBasket){
    return this.httpClient.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe(() => {
      this.basketSource.next(null);
      this.basketTotalSource.next(null);
      localStorage.removeItem('basket_id');
    }, error => {
      console.log(error);
    });
  }
  deleteLocalBasket(id: string){
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem('basket_id');

  }
}

