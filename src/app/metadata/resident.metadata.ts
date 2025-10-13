import { TableInterface } from "../models/interfaces/table.interface";

export const RESIDENT_COLUMNS: TableInterface[] = [
    {
        field: 'residentId',
        header: 'No',
        class: '!text-center',
        filterType: 'text',
        matchMode: 'startsWith',
        placeholder: 'Filtrar No.',
    },
    {
        field: 'name',
        header: 'Nombre',
        class: '',
        filterType: 'text',
        matchMode: 'contains',
        placeholder: 'Filtrar Nombre'
    },
    {
        field: 'dni',
        header: 'Cédula',
        class: '',
        filterType: 'numeric',
        matchMode: 'equals',
        placeholder: 'Filtrar Cédula',
    },
    {
        field: 'accomodation',
        header: 'Acomodación',
        class: '!text-center',
        filterType: 'text',
        matchMode: 'contains',
        placeholder: 'Filtrar Acomodación'
    },
    {
        field: 'guardian',
        header: 'Acudiente',
        class: '',
        filterType: 'text',
        matchMode: 'contains',
        placeholder: 'Filtrar Acudiente'
    },
    {
        field: 'guardianDni',
        header: 'CC Acudiente',
        class: '',
        filterType: 'numeric',
        matchMode: 'equals',
        placeholder: 'Filtrar CC Acudiente'
    },
    {
        field: 'address',
        header: 'Dirección',
        class: '',
        filterType: 'text',
        matchMode: 'contains',
        placeholder: 'Filtrar Dirección'
    },
    {
        field: 'phone',
        header: 'Teléfono',
        class: '',
        filterType: 'text',
        matchMode: 'contains',
        placeholder: 'Filtrar Teléfono'
    },
    {
        field: 'value',
        header: 'Valor Unitario',
        class: '!text-end',
        filterType: 'numeric',
        matchMode: 'equals',
        placeholder: 'Filtrar Valor Unitario'
    },
    {
        field: 'paymentMethod',
        header: 'Forma de Pago',
        class: '!text-center',
        filterType: 'text',
        matchMode: 'contains',
        placeholder: 'Filtrar Forma de Pago'
    },
    {
        field: 'entryDate',
        header: 'Fecha Ingreso',
        class: '!text-center',
        filterType: 'date',
        matchMode: 'equals',
        placeholder: 'Filtrar Fecha de Ingreso'
    },
    {
        field: 'months',
        header: 'Meses',
        class: '!text-center',
        filterType: 'numeric',
        matchMode: 'equals',
        placeholder: 'Filtrar Meses'
    },
    {
        field: 'status',
        header: 'Estado',
        class: '!text-center',
        template: true
    },
    {
        field: 'actions',
        header: '',
        class: '!text-center',
        frozen: true,
        alignFrozen: 'right',
        button: true
    }
];