import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../models/interfaces/login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(body: Login): Observable<any> {
    return this.http.post<any>(`http://localhost:8080/api/auth/login`, body);
  }
}
