import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface User {
    id?: number;
    name: string;
    email: string;
}

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    private apiUrl = 'http://localhost:3000/user';

    constructor(private http: HttpClient) { }

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }

    getUser(id: number): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id}`);
    }

    createUser(user: Partial<User>): Observable<User> {
        return this.http.post<User>(this.apiUrl, user);
    }

    deleteUser(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
