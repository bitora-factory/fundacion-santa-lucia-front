import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ResidentModel } from "../models/resident.model";
import { BaseCrudService } from "./base-crud.service";

@Injectable({ providedIn: 'root' })
export class ReceiptService extends BaseCrudService<any> {
    protected controller = 'receipt';

    constructor(http: HttpClient) {
        super(http);
    }

    save(receipt: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/${this.controller}`, { receipt });
    }

    /* Additional methods specific to residents can be added here */
}