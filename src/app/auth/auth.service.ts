import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from '../../enviroment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${enviroment.apiUrl}/api/auth`;

  constructor(private http: HttpClient) {}

  login(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, userData);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }
}
