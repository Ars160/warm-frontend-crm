import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { enviroment } from '../../../enviroment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${enviroment.apiUrl}/api/categories/`; // исправь под свой API

  constructor(private http: HttpClient) {}

  createCategory(category: { name: string, description: string }) {
    return this.http.post(this.apiUrl, category);
  }  

  getCategories() {
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteCategory(id: string) {
    return this.http.delete(`${this.apiUrl}${id}`);
  }
}
