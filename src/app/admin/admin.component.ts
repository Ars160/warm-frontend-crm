import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [RouterModule, CommonModule],
  selector: 'app-admin',
  template: `
    <div class="admin-container">
      <!-- Компактная боковая панель -->
      <aside class="sidebar">
        <div class="logo-container">
          <div class="logo-icon">⚡</div>
        </div>

        <nav class="navigation">
          <ul class="nav-list">
            <li class="nav-item" [class.active]="isActive('/admin/dashboard')">
              <a routerLink="/admin/dashboard" class="nav-link" title="Dashboard">
                <span class="nav-icon">📊</span>
                <span class="nav-text">Dashboard</span>
              </a>
            </li>
            
            <li class="nav-item" [class.active]="isActive('/admin/categories')">
              <a routerLink="/admin/categories" class="nav-link" title="Категории">
                <span class="nav-icon">🗂️</span>
                <span class="nav-text">Категории</span>
              </a>
            </li>
            
            <li class="nav-item" [class.active]="isActive('/admin/products')">
              <a routerLink="/admin/products" class="nav-link" title="Товары">
                <span class="nav-icon">🛍️</span>
                <span class="nav-text">Товары</span>
              </a>
            </li>
            
            <li class="nav-item" [class.active]="isActive('/admin/drop')">
              <a routerLink="/admin/drop" class="nav-link" title="Приходы">
                <span class="nav-icon">📥</span>
                <span class="nav-text">Приходы</span>
              </a>
            </li>
          </ul>
        </nav>

        <div class="settings">
          <a href="#" class="settings-link" title="Настройки">
            <span class="nav-icon">⚙️</span>
          </a>
        </div>
      </aside>

      <!-- Основная область контента -->
      <div class="content-wrapper">
        <header class="header">
          <div class="header-left">
            <button class="menu-toggle">
              <span>☰</span>
            </button>
            <h1 class="page-title">{{ getPageTitle() }}</h1>
          </div>
          <div class="user-menu">
            <div class="notifications">
              <span class="notification-badge">3</span>
              <span class="nav-icon">🔔</span>
            </div>
            <div class="user-avatar">AD</div>
          </div>
        </header>

        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    /* Основные стили */
    .admin-container {
      display: flex;
      min-height: 100vh;
      background-color: #f5f7fa;
    }

    /* Боковая панель */
    .sidebar {
      width: 80px;
      background-color: #1a1a2e;
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px 0;
      transition: width 0.3s ease;
    }

    .sidebar:hover {
      width: 220px;
    }

    .sidebar:hover .nav-text {
      display: inline;
    }

    .logo-container {
      margin-bottom: 30px;
    }

    .logo-icon {
      font-size: 28px;
      background-color: #4a00e0;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Навигация */
    .navigation {
      flex: 1;
      width: 100%;
    }

    .nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .nav-item {
      width: 100%;
      margin-bottom: 8px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      color: #e2e8f0;
      text-decoration: none;
      padding: 12px 0;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .nav-item:hover .nav-link {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .nav-item.active .nav-link {
      background-color: #4a00e0;
    }

    .nav-icon {
      font-size: 24px;
      margin: 0 18px;
      flex-shrink: 0;
    }

    .nav-text {
      display: none;
      font-size: 14px;
      white-space: nowrap;
    }

    /* Основное содержимое */
    .content-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    /* Шапка */
    .header {
      height: 60px;
      background-color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
    }

    .header-left {
      display: flex;
      align-items: center;
    }

    .menu-toggle {
      background: none;
      border: none;
      font-size: 20px;
      margin-right: 15px;
      cursor: pointer;
    }

    .page-title {
      font-size: 18px;
      font-weight: 600;
      color: #2d3748;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .notifications {
      position: relative;
      cursor: pointer;
    }

    .notification-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background-color: #f56565;
      color: white;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      font-size: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: #4a00e0;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }

    /* Основной контент */
    .main-content {
      flex: 1;
      padding: 20px;
      background-color: #f5f7fa;
    }

    /* Настройки */
    .settings {
      margin-top: auto;
      padding: 20px 0;
    }

    .settings-link {
      color: #e2e8f0;
      font-size: 24px;
      display: block;
      text-align: center;
    }
  `]
})
export class AdminComponent {
  isActive(path: string): boolean {
    return window.location.pathname.startsWith(path);
  }

  getPageTitle(): string {
    const path = window.location.pathname;
    if (path.includes('dashboard')) return 'Dashboard';
    if (path.includes('categories')) return 'Категории';
    if (path.includes('products')) return 'Товары';
    if (path.includes('drop')) return 'Приходы';
    return 'Админ панель';
  }
}