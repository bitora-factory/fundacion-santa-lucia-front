import { TableInterface } from "../models/interfaces/table.interface";

export const RESIDENT_COLUMNS: TableInterface[] = [
    { field: 'id', header: 'No', class: '!text-center' },
    { field: 'name', header: 'NOMBRE', class: '' },
    { field: 'dni', header: 'CÉDULA', class: '' },
    { field: 'accomodation', header: 'ACOMODACIÓN', class: '!text-center' },
    { field: 'guardian', header: 'ACUDIENTE', class: '' },
    { field: 'guardianDni', header: 'CC_ACUDIENTE', class: '' },
    { field: 'address', header: 'DIRECCIÓN', class: '' },
    { field: 'phone', header: 'TELÉFONO', class: '' },
    { field: 'value', header: 'VALOR UNITARIO', class: '!text-center' },
    { field: 'payment', header: 'FORMA PAGO', class: '!text-center' },
    { field: 'entryDate', header: 'FECHA INGRESO', class: '!text-center' },
    { field: 'months', header: 'MESES', class: '!text-center' },
    { field: 'status', header: 'ESTADO', class: '!text-center' },
    { field: 'actions', header: 'ACCIONES', class: '!text-center', frozen: true }
];