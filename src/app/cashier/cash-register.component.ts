import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { enviroment } from '../../enviroment';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  selector: 'app-cash-register',
  templateUrl: './cash-register.component.html',
  styleUrls: ['./cash-register.component.css']
})
export class CashRegisterComponent implements OnInit {
  products: any[] = [];
  cart: any[] = [];
  paymentMethod: string = 'cash';
  searchQuery: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.http.get(`${enviroment.apiUrl}/api/products`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: (res: any) => {
        this.products = res;
        this.isLoading = false;
        console.log(this.products);
        
      },
      error: (err) => {
        this.errorMessage = 'Ошибка при загрузке товаров';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  get filteredProducts() {
    return this.products.filter(product => 
      product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  addToCart(product: any, quantity: number) {
    if (quantity <= 0 || isNaN(quantity)) {
      this.errorMessage = 'Введите корректное количество';
      return;
    }
  
    const exists = this.cart.find(item => item.productId === product._id);
    if (exists) {
      exists.quantity += quantity;
    } else {
      this.cart.push({
        productId: product._id,
        quantity,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl // Добавляем изображение в корзину
      });
    }
  
    this.successMessage = `${product.name} добавлен в корзину (${quantity} шт.)`;
    setTimeout(() => this.successMessage = '', 3000);
  }

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
  }

  updateQuantity(item: any, newQuantity: number) {
    if (newQuantity <= 0) {
      this.removeFromCart(this.cart.indexOf(item));
      return;
    }
    item.quantity = newQuantity;
  }

  get totalAmount() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  makeSale() {
    if (this.cart.length === 0) return;

    const saleData = {
      paymentMethod: this.paymentMethod,
      items: this.cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };

    this.isLoading = true;
    this.http.post(`${enviroment.apiUrl}/api/sales`, saleData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: () => {
        this.successMessage = 'Продажа успешно оформлена!';
        this.cart = [];
        this.isLoading = false;
        setTimeout(() => this.successMessage = '', 5000);
      },
      error: (err) => {
        this.errorMessage = 'Ошибка при оформлении продажи';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}