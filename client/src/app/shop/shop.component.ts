import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { report } from 'process';
import { IProduct } from '../shared/models/product';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  products: IProduct[];
  constructor(private shopService : ShopService) { }

  ngOnInit() {
    this.shopService.getProducts().subscribe(response =>{
      this.products =response.data;
    })
}

}
