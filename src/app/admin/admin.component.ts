import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-admin',
  template: `
    <nav>
      <!-- твое меню -->
      <ul>
        <li><a routerLink="/admin/dashboard">Dashboard</a></li>
        <li><a routerLink="/admin/categories">Категории</a></li>
        <li><a routerLink="/admin/products">Товары</a></li>
        <li><a routerLink="/admin/orders" routerLinkActive="active">Приходы</a></li>
        <li><a routerLink="/admin/sales" routerLinkActive="active">Продажи</a></li>
      </ul>
    </nav>

    <router-outlet></router-outlet>
  `,
})
export class AdminComponent {}
