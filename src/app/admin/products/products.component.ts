import { Component, OnInit } from '@angular/core';
import { ProductService } from './product.service';
import { CategoryService } from '../categories/category.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  isEditing = false;
  currentProductId: string | null = null;

  productForm = {
    name: '',
    sku: '',
    price: 0,
    quantity: 0,
    imageUrl: '',
    categoryId: ''
  };

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (res) => this.products = res,
      error: (err) => console.error('Ошибка загрузки продуктов', err),
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        console.log('Loaded categories:', res); // Добавьте лог
        this.categories = res;
      },
      error: (err) => {
        console.error('Ошибка загрузки категорий', err);
        alert('Не удалось загрузить категории');
      }
    });
  }

  initEditProduct(product: any): void {
    this.isEditing = true;
    this.currentProductId = product._id;
    this.productForm = {
      name: product.name,
      sku: product.sku,
      price: product.price,
      quantity: product.quantity,
      imageUrl: product.imageUrl || '',
      categoryId: product.category?._id || product.category || ''
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.currentProductId = null;
    this.resetForm();
  }

  submitProduct(): void {
    if (!this.validateForm()) return;

    const productData = {
      name: this.productForm.name,
      sku: this.productForm.sku,
      price: this.productForm.price,
      quantity: this.productForm.quantity,
      imageUrl: this.productForm.imageUrl,
      category: this.productForm.categoryId
    };

    if (this.isEditing && this.currentProductId) {
      this.updateProduct(this.currentProductId, productData);
    } else {
      this.createProduct(productData);
    }
  }

  createProduct(product: any): void {
    this.productService.createProduct(product).subscribe({
      next: () => {
        alert('Продукт успешно создан');
        this.resetForm();
        this.loadProducts();
      },
      error: (err) => {
        console.error('Ошибка создания продукта', err);
        alert('Ошибка создания продукта');
      }
    });
  }

  updateProduct(id: string, product: any): void {
    this.productService.updateProduct(id, product).subscribe({
      next: () => {
        alert('Продукт успешно обновлён');
        this.cancelEdit();
        this.loadProducts();
      },
      error: (err) => {
        console.error('Ошибка обновления продукта', err);
        alert('Ошибка обновления продукта');
      }
    });
  }

  deleteProduct(id: string): void {
    if (confirm('Вы уверены, что хотите удалить этот продукт?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          alert('Продукт удалён');
          this.loadProducts();
        },
        error: (err) => {
          console.error('Ошибка удаления продукта', err);
          alert('Ошибка удаления продукта');
        },
      });
    }
  }

  private validateForm(): boolean {
    if (!this.productForm.name.trim()) {
      alert('Введите название продукта');
      return false;
    }
    if (!this.productForm.sku.trim()) {
      alert('Введите SKU продукта');
      return false;
    }
    if (!this.productForm.categoryId) {
      alert('Выберите категорию');
      return false;
    }
    return true;
  }

  private resetForm(): void {
    this.productForm = {
      name: '',
      sku: '',
      price: 0,
      quantity: 0,
      imageUrl: '',
      categoryId: ''
    };
  }
}