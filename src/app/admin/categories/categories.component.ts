import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoryService } from './category.service'; // создадим позже
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  newCategoryName = '';
  newCategoryDescription = '';

createCategory() {
  if (!this.newCategoryName.trim()) {
    alert('Название не может быть пустым');
    return;
  }

  this.categoryService.createCategory({ name: this.newCategoryName, description: this.newCategoryDescription }).subscribe({
    next: () => {
      alert('Категория создана');
      this.newCategoryName = '';
      this.newCategoryDescription = '';
      this.loadCategories();
    },
    error: (err) => {
      console.error('Ошибка создания категории', err);
      alert('Ошибка создания категории');
    }
  });
}


  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories = res;
      },
      error: (err) => {
        console.error('Ошибка загрузки категорий', err);
      }
    });
  }

  deleteCategory(id: string) {
    if (confirm('Удалить категорию?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          alert('Категория удалена');
          this.loadCategories();
        },
        error: (err) => {
          console.error('Ошибка удаления', err);
        }
      });
    }
  }
}
