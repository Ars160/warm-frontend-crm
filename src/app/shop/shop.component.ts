import { Component, HostListener } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <div class="admin-container">
      <!-- Боковая панель -->
      <aside class="sidebar" 
             (mouseenter)="expandSidebar()" 
             (mouseleave)="collapseSidebar()"
             [class.expanded]="sidebarExpanded">
        <div class="logo-container">
          <div class="logo-icon">⚡</div>
          <span class="logo-text">{{ getRoleName() }} Panel</span>
        </div>

        <nav class="navigation">
          <ul class="nav-list">
            <li class="nav-item" 
                *ngFor="let item of getMenuItems()" 
                [class.active]="isActive(item.link)">
              <a [routerLink]="item.link" class="nav-link" [title]="item.label">
                <span class="nav-icon">{{ item.icon }}</span>
                <span class="nav-text">{{ item.label }}</span>
              </a>
            </li>
          </ul>
        </nav>

        <div class="logout-section">
          <div class="logout-item" (click)="logout()">
            <span class="nav-icon">🚪</span>
            <span class="nav-text">Выйти</span>
          </div>
        </div>
      </aside>

      <!-- Основная область -->
      <div class="content-wrapper">
        <header class="header">
          <div class="header-left">
            <button class="menu-toggle" (click)="toggleSidebar()">
              <span>☰</span>
            </button>
            <h1 class="page-title">{{ getPageTitle() }}</h1>
          </div>
          
          <div class="user-menu">
            <div class="notifications" *ngIf="userRole === 'admin'">
              <span class="notification-badge">3</span>
              <span class="nav-icon">🔔</span>
            </div>
            <div class="user-avatar">
              {{ getUserInitials() }}
            </div>
            <span class="user-name">
              {{ getUserName() }}
              <span class="user-role">{{ getRoleName() }}</span>
            </span>
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
    :host {
      --primary-color: #4a00e0;
      --sidebar-bg: #1a1a2e;
      --sidebar-text: #e2e8f0;
      --sidebar-width: 80px;
      --sidebar-expanded-width: 220px;
      --header-height: 60px;
      --transition-speed: 0.2s;
    }
    
    .admin-container {
      display: flex;
      min-height: 100vh;
      background-color: #f5f7fa;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    /* Боковая панель */
    .sidebar {
      width: var(--sidebar-width);
      background-color: var(--sidebar-bg);
      color: var(--sidebar-text);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px 0;
      transition: all var(--transition-speed) ease;
      position: relative;
      z-index: 100;
      overflow: hidden;
    }

    .sidebar.expanded {
      width: var(--sidebar-expanded-width);
      align-items: flex-start;
      padding: 20px 15px;
    }

    .logo-container {
      margin-bottom: 30px;
      display: flex;
      align-items: center;
      padding: 0 10px;
      min-width: calc(var(--sidebar-expanded-width) - 30px);
    }

    .logo-icon {
      font-size: 28px;
      background-color: var(--primary-color);
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: transform var(--transition-speed) ease;
    }

    .sidebar:hover .logo-icon,
    .sidebar.expanded .logo-icon {
      transform: rotate(15deg);
    }

    .logo-text {
      margin-left: 15px;
      font-size: 18px;
      font-weight: 600;
      white-space: nowrap;
      opacity: 0;
      transition: opacity var(--transition-speed) ease;
    }

    .sidebar:hover .logo-text,
    .sidebar.expanded .logo-text {
      opacity: 1;
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
      width: 100%;
    }

    .nav-item {
      width: 100%;
      margin-bottom: 8px;
      border-radius: 8px;
      overflow: hidden;
    }

    .nav-link {
      display: flex;
      align-items: center;
      color: var(--sidebar-text);
      text-decoration: none;
      padding: 12px 10px;
      transition: all var(--transition-speed) ease;
      min-width: calc(var(--sidebar-expanded-width) - 30px);
    }

    .nav-item:hover .nav-link {
      background-color: rgba(255, 255, 255, 0.1);
      transform: translateX(5px);
    }

    .nav-item.active .nav-link {
      background-color: var(--primary-color);
      font-weight: 500;
    }

    .nav-icon {
      font-size: 24px;
      margin-right: 15px;
      flex-shrink: 0;
      width: 24px;
      text-align: center;
      transition: transform var(--transition-speed) ease;
    }

    .nav-item:hover .nav-icon {
      transform: scale(1.1);
    }

    .nav-text {
      opacity: 0;
      font-size: 14px;
      white-space: nowrap;
      transition: opacity var(--transition-speed) ease;
    }

    .sidebar:hover .nav-text,
    .sidebar.expanded .nav-text {
      opacity: 1;
    }

    /* Выход */
    .logout-section {
      margin-top: auto;
      padding-top: 20px;
      width: 100%;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logout-item {
      display: flex;
      align-items: center;
      padding: 12px 10px;
      border-radius: 8px;
      cursor: pointer;
      transition: all var(--transition-speed) ease;
    }

    .logout-item:hover {
      background-color: rgba(255, 255, 255, 0.1);
      transform: translateX(5px);
    }

    /* Основное содержимое */
    .content-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      transition: margin-left var(--transition-speed) ease;
    }

    /* Шапка */
    .header {
      height: var(--header-height);
      background-color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      position: sticky;
      top: 0;
      z-index: 5;
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
      color: #4a5568;
    }

    .page-title {
      font-size: 18px;
      font-weight: 600;
      color: #2d3748;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .notifications {
      position: relative;
      cursor: pointer;
      color: #4a5568;
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
      background-color: var(--primary-color);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      flex-shrink: 0;
    }

    .user-name {
      font-size: 14px;
      display: flex;
      flex-direction: column;
      margin-left: 8px;
    }

    .user-role {
      font-size: 12px;
      color: #718096;
      margin-top: 2px;
    }

    /* Основной контент */
    .main-content {
      flex: 1;
      padding: 20px;
      background-color: #f5f7fa;
      overflow: auto;
    }

    /* Адаптивность */
    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        height: 100vh;
        transform: translateX(calc(-1 * (var(--sidebar-expanded-width) - 20px)));
      }
      
      .sidebar.expanded {
        transform: translateX(0);
      }
      
      .content-wrapper {
        margin-left: 0;
      }
      
      .sidebar:hover {
        width: var(--sidebar-width);
      }
      
      .sidebar:hover .logo-text,
      .sidebar:hover .nav-text {
        opacity: 0;
      }
    }
  `]
})
export class ShopComponent {
  userRole = localStorage.getItem('role') || 'guest';
  sidebarExpanded = false;

  constructor(private router: Router) {}

  // Получаем меню в зависимости от роли
  getMenuItems() {

    const roleMenus = {
      admin: [
        { label: 'Отчеты', link: '/shop/dashboard', icon: '📈' },
        { label: 'Категории', link: '/shop/categories', icon: '🗂️' },
        { label: 'Товары', link: '/shop/products', icon: '🛍️' },
        { label: 'Приходы', link: '/shop/drop', icon: '📥' },
        { label: 'Пользователи', link: '/shop/users', icon: '👥' }
      ],
      manager: [
        { label: 'Отчеты', link: '/shop/dashboard', icon: '📈' },
        { label: 'Приходы', link: '/shop/drop', icon: '📥' }
      ],
      cashier: [
        { label: 'Касса', link: '/shop/cashier', icon: '🛍️' },
        { label: 'Отчеты', link: '/shop/dashboard', icon: '📈' }
      ],
      picker: [
        { label: 'Заказы', link: '/shop/picker', icon: '🛍️' }
      ],
      user: [
        { label: 'Продукты', link: '/shop/user', icon: '🛍️' },
        { label: 'Мой Заказы', link: '/shop/my-orders', icon: '🗂️' }
      ]
    };

    return [...(roleMenus[this.userRole as keyof typeof roleMenus] || [])];
  }

  // Проверка активного маршрута
  isActive(path: string): boolean {
    return this.router.url.startsWith(path);
  }

  // Получаем заголовок страницы
  getPageTitle(): string {
    const path = this.router.url;
    const menuItems = this.getMenuItems();
    const currentItem = menuItems.find(item => path.startsWith(item.link));
    return currentItem?.label || 'Панель управления';
  }

  // Получаем название роли
  getRoleName(): string {
    const roles: {[key: string]: string} = {
      admin: 'Администратор',
      manager: 'Менеджер',
      cashier: 'Кассир',
      picker: 'Сборщик',
      user: 'Пользователь'
    };
    return roles[this.userRole] || this.userRole;
  }

  // Получаем имя пользователя
  getUserName(): string {
    return localStorage.getItem('userName') || 'Пользователь';
  }

  // Получаем инициалы пользователя
  getUserInitials(): string {
    const name = this.getUserName();
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
  }

  // Управление сайдбаром
  expandSidebar() {
    if (window.innerWidth > 768) {
      this.sidebarExpanded = true;
    }
  }

  collapseSidebar() {
    if (window.innerWidth > 768) {
      this.sidebarExpanded = false;
    }
  }

  toggleSidebar() {
    this.sidebarExpanded = !this.sidebarExpanded;
  }

  // Выход из системы
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    this.router.navigate(['/login']);
  }

  // Адаптация для мобильных устройств
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (window.innerWidth <= 768) {
      this.sidebarExpanded = false;
    }
  }
}