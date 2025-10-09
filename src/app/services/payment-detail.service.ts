import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ResidentModel } from "../models/resident.model";
import { BaseCrudService } from "./base-crud.service";
import { PaymentDetailModel } from "../models/payment-detail.model";

@Injectable({ providedIn: 'root' })
export class PaymentDetailService extends BaseCrudService<any> {
    protected controller = 'payment-detail';

    constructor(http: HttpClient) {
        super(http);
    }

    getDetailsByPaymentId(paymentId: number): Observable<PaymentDetailModel[]> {
        return this.http.get<PaymentDetailModel[]>(`${this.apiUrl}/${this.controller}/payment/${paymentId}`);
    }

    /* Additional methods specific to residents can be added here */
}