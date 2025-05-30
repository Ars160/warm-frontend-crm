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
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  productForm = {
    name: '',
    sku: '',
    price: 0,
    quantity: 0,
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
        this.categories = res;
      },
      error: (err) => {
        console.error('Ошибка загрузки категорий', err);
        alert('Не удалось загрузить категории');
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Создаем превью изображения
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  initEditProduct(product: any): void {
    this.isEditing = true;
    this.currentProductId = product._id;
    this.productForm = {
      name: product.name,
      sku: product.sku,
      price: product.price,
      quantity: product.quantity,
      categoryId: product.category?._id || product.category || ''
    };
    this.previewUrl = product.imageUrl || null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.currentProductId = null;
    this.resetForm();
    this.previewUrl = null;
    this.selectedFile = null;
  }

  submitProduct(): void {
    if (!this.validateForm()) return;

    const formData = new FormData();
    formData.append('name', this.productForm.name);
    formData.append('sku', this.productForm.sku);
    formData.append('price', this.productForm.price.toString());
    formData.append('quantity', this.productForm.quantity.toString());
    formData.append('category', this.productForm.categoryId);
    
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if (this.isEditing && this.currentProductId) {
      this.updateProduct(this.currentProductId, formData);
    } else {
      this.createProduct(formData);
    }
  }

  createProduct(formData: FormData): void {
    this.productService.createProduct(formData).subscribe({
      next: () => {
        alert('Продукт успешно создан');
        this.resetForm();
        this.loadProducts();
        this.previewUrl = null;
        this.selectedFile = null;
      },
      error: (err) => {
        console.error('Ошибка создания продукта', err);
        alert('Ошибка создания продукта');
      }
    });
  }

  updateProduct(id: string, formData: FormData): void {
    this.productService.updateProduct(id, formData).subscribe({
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
      categoryId: ''
    };
  }
}