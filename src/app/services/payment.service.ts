import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ResidentModel } from "../models/resident.model";
import { BaseCrudService } from "./base-crud.service";

@Injectable({ providedIn: 'root' })
export class PaymentService extends BaseCrudService<any
> {
    protected endpoint = 'payment';

    constructor(http: HttpClient) {
        super(http);
    }

    getConsecutive(): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/${this.endpoint}/consecutive-number`);
    }

    /* Additional methods specific to residents can be added here */
}