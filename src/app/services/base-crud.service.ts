import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroment';

export abstract class BaseCrudService<T> {
    protected abstract endpoint: string;
    protected apiUrl = environment.apiUrl;

    constructor(protected http: HttpClient) { }

    findAll(): Observable<T[]> {
        return this.http.get<T[]>(`${this.apiUrl}/${this.endpoint}`);
    }

    findOne(id: number): Observable<T> {
        return this.http.get<T>(`${this.apiUrl}/${this.endpoint}/${id}`);
    }

    create(data: Partial<T>): Observable<T> {
        return this.http.post<T>(`${this.apiUrl}/${this.endpoint}`, data);
    }

    update(id: number, data: Partial<T>): Observable<T> {
        return this.http.put<T>(`${this.apiUrl}/${this.endpoint}/${id}`, data);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${this.endpoint}/${id}`);
    }
}