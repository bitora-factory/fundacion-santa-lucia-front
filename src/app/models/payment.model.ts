import { ResidentModel } from "./resident.model";

export interface PaymentModel {
    id: number | null;
    date: Date;
    receiptNumber: string;
    totalAmount: number;
    resident: ResidentModel;
}