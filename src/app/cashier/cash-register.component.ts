import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { enviroment } from '../../enviroment';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule,RouterModule],
  selector: 'app-cash-register',
  templateUrl: './cash-register.component.html'
})
export class CashRegisterComponent implements OnInit {
  products: any[] = [];
  cart: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.http.get(`${enviroment.apiUrl}/api/products`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe((res: any) => {
      this.products = res;
    });
  }

  addToCart(product: any, quantityInput: HTMLInputElement) {
    const quantity = +quantityInput.value;
    if (quantity <= 0) return;

    const exists = this.cart.find(item => item.productId === product._id);
    if (exists) {
      exists.quantity += quantity;
    } else {
      this.cart.push({
        productId: product._id,
        quantity,
        name: product.name
      });
    }

    quantityInput.value = '';
  }

  makeSale() {
    const saleData = {
      paymentMethod: 'cash',
      items: this.cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };

    this.http.post(`${enviroment.apiUrl}/api/sales`, saleData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe(() => {
      alert('Продажа оформлена');
      this.cart = [];
    });
  }
}
