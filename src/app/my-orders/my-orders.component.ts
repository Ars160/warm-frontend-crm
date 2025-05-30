import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { enviroment } from '../../enviroment';
import { FormsModule } from '@angular/forms';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
  quantity: number;
  _id: string;
}

interface Order {
  _id: string;
  createdAt: string;
  status: string;
  items: OrderItem[];
  totalAmount?: number;
  deliveryAddress?: string;
}

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  searchQuery: string = '';
  selectedStatus: string = 'all';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.http.get<Order[]>(`${enviroment.apiUrl}/api/customers/orders`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Ошибка загрузки заказов';
        this.isLoading = false;
        console.error('Ошибка загрузки заказов:', err);
      }
    });
  }

  get filteredOrders(): Order[] {
    return this.orders.filter(order => {
      const matchesStatus = this.selectedStatus === 'all' || order.status === this.selectedStatus;
      const matchesSearch = this.searchQuery === '' || 
        order._id.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        order.items.some(item => 
          item.product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      return matchesStatus && matchesSearch;
    });
  }

  getStatusClass(status: string): string {
    switch(status.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'processing': return 'status-processing';
      case 'cancelled': return 'status-cancelled';
      case 'delivered': return 'status-delivered';
      default: return 'status-default';
    }
  }

  calculateTotal(order: Order): number {
    if (order.totalAmount) return order.totalAmount;
    return order.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }
}