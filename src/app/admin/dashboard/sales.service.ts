import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private apiUrl = 'http://localhost:4000/api/sales'; 

  constructor(private http: HttpClient) {}

  getSales(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getDailySummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/summary/daily`);
  }
}
