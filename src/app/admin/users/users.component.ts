import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { enviroment } from '../../../enviroment';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  currentUserId: string = localStorage.getItem('userId') || '';
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.http.get(`${enviroment.apiUrl}/api/users`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: (res: any) => {
        this.users = res.filter((user: any) => user._id !== this.currentUserId);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Ошибка загрузки пользователей:', error);
        this.errorMessage = 'Не удалось загрузить пользователей';
        this.isLoading = false;
      }
    });
  }

  updateRole(userId: string, newRole: string) {
    this.http.put(`${enviroment.apiUrl}/api/users/${userId}`, { role: newRole }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: () => {
        this.showToast('Роль успешно обновлена', 'success');
        this.loadUsers();
      },
      error: (error) => {
        this.showToast(`Ошибка: ${error.error.message || 'Неизвестная ошибка'}`, 'error');
      }
    });
  }

  deleteUser(userId: string) {
    if (!confirm('Вы уверены, что хотите удалить пользователя? Это действие нельзя отменить.')) {
      return;
    }

    this.http.delete(`${enviroment.apiUrl}/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: () => {
        this.showToast('Пользователь удален', 'success');
        this.loadUsers();
      },
      error: (error) => {
        this.showToast(`Ошибка: ${error.error.message || 'Не удалось удалить пользователя'}`, 'error');
      }
    });
  }

  getRoleName(role: string): string {
    const roles: Record<string, string> = {
      admin: 'Администратор',
      manager: 'Менеджер',
      cashier: 'Кассир',
      picker: 'Сборщик',
      user: 'Пользователь'
    };
    return roles[role] || role;
  }

  getUserInitials(username: string): string {
    if (!username) return '??';
    return username.split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  private showToast(message: string, type: 'success' | 'error') {
    // Здесь можно реализовать toast-уведомления
    alert(`${type === 'success' ? '✓' : '✗'} ${message}`);
  }

  getUserColor(username: string): string {
    if (!username) return '#4a00e0';
    const colors = ['#4a00e0', '#8e2de2', '#e100ff', '#00b4db', '#0083b0'];
    const hash = username.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return colors[hash % colors.length];
  }
}