import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { enviroment } from '../../enviroment';
import { FormsModule } from '@angular/forms';

interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  category?: string;
  quantity?: number; // Добавляем это свойство
}

interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

@Component({
  selector: 'app-products2',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './products2.component.html',
  styleUrls: ['./products2.component.css']
})
export class Products2Component implements OnInit {
  products: Product[] = [];
  cart: CartItem[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  searchQuery: string = '';
  selectedCategory: string = 'all';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.http.get<Product[]>(`${enviroment.apiUrl}/api/customers/products`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: (res) => {
        this.products = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Ошибка загрузки продуктов';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  get filteredProducts(): Product[] {
    return this.products.filter(product => 
      product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
      (this.selectedCategory === 'all' || product.category === this.selectedCategory)
    );
  }

  get categories(): string[] {
    const categories = this.products.map(p => p.category).filter(Boolean);
    return ['all', ...new Set(categories)] as string[];
  }

  addToCart(product: Product, quantity: number) {
    if (quantity <= 0 || isNaN(quantity)) {
      this.errorMessage = 'Пожалуйста, введите корректное количество';
      return;
    }

    const existingItem = this.cart.find(item => item.productId === product._id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({
        productId: product._id,
        productName: product.name,
        price: product.price,
        quantity: quantity,
        imageUrl: product.imageUrl
      });
    }

    this.successMessage = `${product.name} добавлен в корзину (${quantity} шт.)`;
    setTimeout(() => this.successMessage = '', 3000);
  }

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
  }

  updateQuantity(item: CartItem, newQuantity: number) {
    if (newQuantity <= 0) {
      this.removeFromCart(this.cart.indexOf(item));
      return;
    }
    item.quantity = newQuantity;
  }

  get totalAmount(): number {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  placeOrder() {
    if (this.cart.length === 0) {
      this.errorMessage = 'Корзина пуста!';
      return;
    }

    this.isLoading = true;
    const orderItems = this.cart.map(item => ({
      product: item.productId,
      quantity: item.quantity
    }));

    this.http.post(`${enviroment.apiUrl}/api/customers/orders`, 
      { items: orderItems }, 
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: () => {
        this.successMessage = 'Заказ успешно создан!';
        this.cart = [];
        this.isLoading = false;
        setTimeout(() => this.successMessage = '', 5000);
      },
      error: (err) => {
        this.errorMessage = 'Ошибка при создании заказа: ' + (err.error?.message || err.message);
        this.isLoading = false;
      }
    });
  }
}