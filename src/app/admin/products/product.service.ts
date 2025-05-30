import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { enviroment } from '../../../enviroment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${enviroment.apiUrl}/api/products`;

  constructor(private http: HttpClient) {}

  // Создание продукта с возможностью загрузки изображения
  createProduct(productData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, productData);
  }

  // Получение всех продуктов
  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Получение продукта по ID
  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Обновление продукта с возможностью загрузки изображения
  updateProduct(id: string, productData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, productData);
  }

  // Удаление продукта
  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Получение продуктов по категории
  getProductsByCategoryId(categoryId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  // Загрузка изображения (отдельный метод, если нужно)
  uploadImage(imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', imageFile);
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }
}