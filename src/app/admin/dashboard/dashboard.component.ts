import { Component, OnInit } from '@angular/core';
import { SalesService } from './sales.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  salesHistory: any[] = [];
  dailySummary: any[] = []; // Изменено на массив, так как используем *ngFor
  selectedDate: string = new Date().toISOString().split('T')[0];

  constructor(private salesService: SalesService) {}

  ngOnInit(): void {
    this.loadSalesData();
  }

  loadSalesData(): void {
    this.loadDailySummary();
    this.loadSalesHistory();
  }

  loadDailySummary(): void {
    this.salesService.getDailySummary().subscribe({
      next: (data) => {
        this.dailySummary = Array.isArray(data) ? data : [data];
      },
      error: (err) => {
        console.error('Ошибка при получении дневного отчёта', err);
        this.dailySummary = [];
      }
    });
  }

  loadSalesHistory(): void {
    this.salesService.getSales().subscribe({
      next: (data) => {
        this.salesHistory = Array.isArray(data) ? data : [];
        // Сортируем по дате (новые сверху)
        this.salesHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },
      error: (err) => {
        console.error('Ошибка при получении истории продаж', err);
        this.salesHistory = [];
      }
    });
  }

  formatPaymentMethod(method: string): string {
    const methods: {[key: string]: string} = {
      'cash': 'Наличные',
      'card': 'Карта',
      'online': 'Онлайн-оплата'
    };
    return methods[method] || method;
  }
}