import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { enviroment } from '../../enviroment';

@Component({
  selector: 'app-my-orders',
  imports: [CommonModule,RouterModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css'
})
export class MyOrdersComponent implements OnInit {
  orders: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.http.get(`${enviroment.apiUrl}/api/customers/orders`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe((res: any) => {
      this.orders = res;
    });
  }
}
