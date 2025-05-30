import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { enviroment } from '../../enviroment';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-picker',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './picker.component.html',
  styleUrl: './picker.component.css'
})
export class PickerComponent implements OnInit {
  pendingOrders: any[] = [];
  inProgressOrders: any[] = [];
  readyOrders: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

    this.http.get(`${enviroment.apiUrl}/api/pickers/orders?status=pending`, { headers })
      .subscribe((res: any) => {
        this.pendingOrders = res;
      }, (error) => {
        console.error('Ошибка загрузки pending:', error);
      });

    this.http.get(`${enviroment.apiUrl}/api/pickers/orders?status=in_progress`, { headers })
      .subscribe((res: any) => {
        this.inProgressOrders = res;
      }, (error) => {
        console.error('Ошибка загрузки in_progress:', error);
      });

    this.http.get(`${enviroment.apiUrl}/api/pickers/orders?status=ready`, { headers })
      .subscribe((res: any) => {
        this.readyOrders = res;
      }, (error) => {
        console.error('Ошибка загрузки ready:', error);
      });
  }

  acceptOrder(orderId: string) {
    this.http.post(`${enviroment.apiUrl}/api/pickers/orders/${orderId}/accept`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe(() => {
      alert('Заказ принят!');
      this.loadOrders();
    }, (error) => {
      alert('Ошибка при принятии заказа: ' + error.error.message);
    });
  }

  completeOrder(orderId: string) {
    this.http.post(`${enviroment.apiUrl}/api/pickers/orders/${orderId}/complete`, 
      { status: 'completed' }, // или пустое тело, если бэкенд так обрабатывает
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    ).subscribe(() => {
      alert('Заказ завершён!');
      this.loadOrders();
    }, (error) => {
      alert('Ошибка завершения заказа: ' + error.error.message);
    });
  }
}
