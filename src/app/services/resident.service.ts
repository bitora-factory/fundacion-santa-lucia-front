import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ResidentModel } from "../models/resident.model";
import { BaseCrudService } from "./base-crud.service";

@Injectable({ providedIn: 'root' })
export class ResidentService extends BaseCrudService<ResidentModel> {
    protected controller = 'resident';

    constructor(http: HttpClient) {
        super(http);
    }

    /* Additional methods specific to residents can be added here */
    createResidentRelation(data: ResidentModel): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/${this.controller}/relation`, data);
    }

    deleteResidentRelation(data: ResidentModel): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/${this.controller}/delete-relation`, data);
    }
}