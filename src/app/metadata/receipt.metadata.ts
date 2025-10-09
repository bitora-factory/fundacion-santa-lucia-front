import { TableInterface } from "../models/interfaces/table.interface";

export const RECEIPT_COLUMNS: TableInterface[] = [
    { field: 'receiptNumber', header: 'No. RECIBO', class: '!text-center' },
    { field: 'resident', header: 'RESIDENTE', class: '' },
    { field: 'totalAmount', header: 'TOTAL', class: '!text-end' },
    { field: 'date', header: 'FECHA', class: '!text-center' },
    { field: 'actions', header: 'ACCIONES', class: '!text-center', frozen: true }
];