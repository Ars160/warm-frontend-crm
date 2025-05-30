import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { enviroment } from '../../../enviroment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  currentUserId: string = localStorage.getItem('userId') || ''; // получаем id текущего пользователя

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.http.get(`${enviroment.apiUrl}/api/users`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe((res: any) => {
      // отфильтруем, чтобы исключить себя
      this.users = res.filter((user: any) => user._id !== this.currentUserId);
    }, (error) => {
      console.error('Ошибка загрузки пользователей:', error);
    });
  }

  updateRole(userId: string, newRole: string) {
    this.http.put(`${enviroment.apiUrl}/api/users/${userId}`, { role: newRole }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe(() => {
      alert('Роль обновлена!');
      this.loadUsers();
    }, (error) => {
      alert('Ошибка при обновлении роли: ' + error.error.message);
    });
  }
}
