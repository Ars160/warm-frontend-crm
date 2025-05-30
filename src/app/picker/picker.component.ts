import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { enviroment } from '../../enviroment';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface OrderItem {
  product: string;
  quantity: number;
  _id: string;
}

interface Order {
  _id: string;
  assignedTo: string;
  createdAt: string;
  items: OrderItem[];
  status: string;
  user: string;
  __v: number;
}

@Component({
  selector: 'app-picker',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './picker.component.html',
  styleUrls: ['./picker.component.css']
})
export class PickerComponent implements OnInit {
  orders: Order[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  searchQuery: string = '';
  selectedStatus: string = 'all';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    this.errorMessage = '';
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

    this.http.get<Order[]>(`${enviroment.apiUrl}/api/pickers/orders`, { headers })
      .subscribe({
        next: (orders) => {
          this.orders = orders;
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Ошибка загрузки заказов';
          this.isLoading = false;
          console.error('Ошибка загрузки заказов:', error);
        }
      });
  }

  get filteredOrders(): Order[] {
    return this.orders.filter(order => {
      const matchesStatus = this.selectedStatus === 'all' || order.status === this.selectedStatus;
      const matchesSearch = this.searchQuery === '' || 
        order._id.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        order.user.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }

  acceptOrder(orderId: string) {
    this.isLoading = true;
    this.http.post<Order>(`${enviroment.apiUrl}/api/pickers/orders/${orderId}/accept`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: (updatedOrder) => {
        this.updateOrderStatus(updatedOrder);
        this.successMessage = 'Заказ успешно принят!';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = 'Ошибка при принятии заказа: ' + (error.error?.message || error.message);
        this.isLoading = false;
      }
    });
  }

  completeOrder(orderId: string) {
    this.isLoading = true;
    this.http.post<Order>(`${enviroment.apiUrl}/api/pickers/orders/${orderId}/complete`, 
      {}, 
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: (updatedOrder) => {
        this.updateOrderStatus(updatedOrder);
        this.successMessage = 'Заказ успешно завершён!';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = 'Ошибка завершения заказа: ' + (error.error?.message || error.message);
        this.isLoading = false;
      }
    });
  }

  private updateOrderStatus(updatedOrder: Order) {
    this.orders = this.orders.map(order => 
      order._id === updatedOrder._id ? updatedOrder : order
    );
    this.isLoading = false;
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'pending': return 'status-pending';
      case 'in_progress': return 'status-in-progress';
      case 'ready': return 'status-ready';
      default: return '';
    }
  }
}