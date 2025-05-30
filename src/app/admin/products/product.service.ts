// product.service.ts
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

  createProduct(product: any): Observable<any> {
    return this.http.post(this.apiUrl, product);
  }

  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateProduct(id: string, product: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getProductsByCategoryId(categoryId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/category/${categoryId}`);
  }
}