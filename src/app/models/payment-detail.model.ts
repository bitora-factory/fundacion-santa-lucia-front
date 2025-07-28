export interface PaymentDetailModel {
  id: number | null;
  code: string;
  article: string;
  units: number | null;
  unitPrice: number | null;
  total: number | null;
}
