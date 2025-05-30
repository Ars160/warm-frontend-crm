import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { enviroment } from '../../../enviroment';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private apiUrl = `${enviroment.apiUrl}/api/sales`; 

  constructor(private http: HttpClient) {}

  getSales(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getDailySummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/summary/daily`);
  }
}
