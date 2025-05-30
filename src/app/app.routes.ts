import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AdminGuard } from './auth/admin.guard';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'shop',
    loadComponent: () => import('./shop/shop.component').then(m => m.ShopComponent),
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'categories', loadComponent: () => import('./admin/categories/categories.component').then(m => m.CategoriesComponent) },
      { path: 'products', loadComponent: () => import('./admin/products/products.component').then(m => m.ProductsComponent) },
      { path: 'drop', loadComponent: () => import('./admin/admin-drop/admin-drop.component').then(m => m.AdminDropComponent) },
      { path: 'users', loadComponent: () => import('./admin/users/users.component').then(m => m.UsersComponent) },

      {
        path: 'cashier',
        loadComponent: () => import('./cashier/cash-register.component').then(m => m.CashRegisterComponent),
      },

      {
        path: 'picker',
        loadComponent: () => import('./picker/picker.component').then(m => m.PickerComponent),
      },

      {
        path: 'user',
        loadComponent: () => import('./products2/products2.component').then(m => m.Products2Component),
      },

      {
        path: 'my-orders',
        loadComponent: () => import('./my-orders/my-orders.component').then(m => m.MyOrdersComponent),
      }
      
    ]
  }
];
