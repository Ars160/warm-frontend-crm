import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [FormsModule, RouterModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    const userData = { username: this.username, password: this.password };
    this.authService.login(userData).subscribe({
      next: (res) => {
        console.log('Успешный логин', res);
  
        // Сохраняем токен и роль
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
  
        // Редирект по роли
        this.navigateByRole(res.role);
      },
      error: (err) => {
        console.error('Ошибка логина', err);
        alert('Ошибка логина: проверьте имя пользователя и пароль');
      }
    });
  }

  navigateByRole(role: string) {
    if (role === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    } else if (role === 'store_manager') {
      this.router.navigate(['/store']);
    } else if (role === 'cashier') {
      this.router.navigate(['/shop']);
    } else if (role === 'picker') {
      this.router.navigate(['/picker']);
    } else {
      this.router.navigate(['/']);
    }
  }
  
  
}
