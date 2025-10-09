export interface PaymentDetailModel {
  id: number | null;
  paymentId: number | null;
  code: string;
  detail: string;
  units: number | null;
  unitPrice: number | null;
  total: number | null;
}
