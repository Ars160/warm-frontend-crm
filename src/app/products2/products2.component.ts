import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { enviroment } from '../../enviroment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products2',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './products2.component.html',
  styleUrl: './products2.component.css'
})
export class Products2Component implements OnInit {
  products: any[] = [];
  cart: { product: string; quantity: number }[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.http.get(`${enviroment.apiUrl}/api/customers/products`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe((res: any) => {
      this.products = res;
    });
  }

  addToCart(productId: string, quantity: number) {
    this.cart.push({ product: productId, quantity });
  }

  placeOrder() {
    if (this.cart.length === 0) {
      alert('Корзина пуста!');
      return;
    }

    this.http.post(`${enviroment.apiUrl}/api/customers/orders`, { items: this.cart }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe(() => {
      alert('Заказ создан!');
      this.cart = [];
    });
  }
}
