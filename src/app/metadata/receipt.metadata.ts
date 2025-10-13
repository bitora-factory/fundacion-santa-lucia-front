import { TableInterface } from "../models/interfaces/table.interface";

export const RECEIPT_COLUMNS: TableInterface[] = [
    { field: 'receiptNumber', header: 'Recibo No', class: '!text-center' },
    { field: 'resident', header: 'Residente', class: '!text-center' },
    { field: 'totalAmount', header: 'Total', class: '!text-end' },
    { field: 'date', header: 'Fecha', class: '!text-center' },
    { field: 'actions', header: '', class: '!text-center', frozen: true }
];