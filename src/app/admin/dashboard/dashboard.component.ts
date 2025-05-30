import { Component, OnInit } from '@angular/core';
import { SalesService } from './sales.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule,RouterModule],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  salesHistory: any[] = [];
  dailySummary: any = {};

  constructor(private salesService: SalesService) {}

  ngOnInit(): void {
    this.loadSalesData();
  }

  loadSalesData(): void {
    // Загружаем историю продаж
    this.salesService.getSales().subscribe({
      next: (data) => {
        this.salesHistory = data;
        
      },
      error: (err) => {
        console.error('Ошибка при получении истории продаж', err);
      }
    });

    // Загружаем суточный отчёт
    this.salesService.getDailySummary().subscribe({
      next: (data) => {
        this.dailySummary = data;
        console.log(this.dailySummary);
        
      },
      error: (err) => {
        console.error('Ошибка при получении дневного отчёта', err);
      }
    });
  }
}
