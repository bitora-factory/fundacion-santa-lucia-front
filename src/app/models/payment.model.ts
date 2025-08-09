import { ResidentModel } from "./resident.model";

export interface PaymentModel {
    id: number | null;
    date: Date;
    receiptNumber: number;
    totalAmount: number;
    resident: ResidentModel;
}