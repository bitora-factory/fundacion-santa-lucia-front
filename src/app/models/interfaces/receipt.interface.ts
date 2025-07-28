import { PaymentDetailModel } from "../payment-detail.model";
import { PaymentModel } from "../payment.model";

export interface ReceiptInterface {
    payment: PaymentModel;   
    paymentDetails: PaymentDetailModel[]; 
}