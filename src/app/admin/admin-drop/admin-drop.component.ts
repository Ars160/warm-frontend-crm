// admin-drop.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { enviroment } from '../../../enviroment';

interface DropItem {
  productId: string;
  quantity: number;
}

interface Drop {
  _id: string;
  supplier: string;
  date: string;
  items: DropItem[];
  acceptedBy: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-admin-drop',
  templateUrl: './admin-drop.component.html',
  styleUrls: ['./admin-drop.component.css']
})
export class AdminDropComponent implements OnInit {
  drops: Drop[] = [];
  newDrop: { supplier: string; items: DropItem[] } = { supplier: '', items: [] };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchDrops();
  }

  fetchDrops() {
    this.http.get<Drop[]>(`${enviroment.apiUrl}/api/orders`).subscribe({
      next: (data) => this.drops = data,
      error: (err) => console.error('Ошибка загрузки приходов:', err)
    });
  }

  createDrop() {
    if (!this.newDrop.supplier || this.newDrop.items.length === 0) {
      alert('Все поля должны быть заполнены');
      return;
    }

    this.http.post(`${enviroment.apiUrl}/api/orders`, this.newDrop).subscribe({
      next: () => {
        this.fetchDrops();
        this.newDrop = { supplier: '', items: [] };
      },
      error: (err) => console.error('Ошибка создания прихода:', err)
    });
  }

  addItem(productId: string, quantity: number) {
    this.newDrop.items.push({ productId, quantity });
  }
}
