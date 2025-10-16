import { TableInterface } from "../models/interfaces/table.interface";

export const RESIDENT_COLUMNS: TableInterface[] = [
    {
        field: 'residentId',
        header: 'No',
        class: '!text-center',
        filterType: 'text',
        matchMode: 'startsWith',
        placeholder: 'Filtrar No.',
        sortable: true
    },
    {
        field: 'name',
        header: 'Nombre',
        class: '',
        filterType: 'text',
        matchMode: 'contains',
        placeholder: 'Filtrar Nombre',
        sortable: true
    },
    {
        field: 'dni',
        header: 'Cédula',
        class: '',
        filterType: 'numeric',
        matchMode: 'equals',
        placeholder: 'Filtrar Cédula',
        sortable: true
    },
    {
        field: 'accomodation',
        header: 'Acomodación',
        class: '!text-center',
        filterType: 'text',
        matchMode: 'contains',
        placeholder: 'Filtrar Acomodación',
        sortable: true
    },
    {
        field: 'guardian',
        header: 'Acudiente',
        class: '',
        filterType: 'text',
        matchMode: 'contains',
        placeholder: 'Filtrar Acudiente',
        sortable: true
    },
    {
        field: 'guardianDni',
        header: 'CC Acudiente',
        class: '',
        filterType: 'numeric',
        matchMode: 'equals',
        placeholder: 'Filtrar CC Acudiente',
        sortable: true
    },
    {
        field: 'address',
        header: 'Dirección',
        class: '',
        filterType: 'text',
        matchMode: 'contains',
        placeholder: 'Filtrar Dirección',
        sortable: true
    },
    {
        field: 'phone',
        header: 'Teléfono',
        class: '',
        filterType: 'text',
        matchMode: 'contains',
        placeholder: 'Filtrar Teléfono',
        sortable: true
    },
    {
        field: 'value',
        header: 'Valor Unitario',
        class: '!text-end',
        filterType: 'numeric',
        matchMode: 'equals',
        placeholder: 'Filtrar Valor Unitario',
        sortable: true
    },
    {
        field: 'paymentMethod',
        header: 'Forma de Pago',
        class: '!text-center',
        filterType: 'text',
        matchMode: 'contains',
        placeholder: 'Filtrar Forma de Pago',
        sortable: true
    },
    {
        field: 'entryDate',
        header: 'Fecha Ingreso',
        class: '!text-center',
        filterType: 'date',
        matchMode: 'equals',
        placeholder: 'Filtrar Fecha de Ingreso',
        sortable: true
    },
    {
        field: 'months',
        header: 'Meses',
        class: '!text-center',
        filterType: 'numeric',
        matchMode: 'equals',
        placeholder: 'Filtrar Meses',
        sortable: true
    },
    {
        field: 'status',
        header: 'Estado',
        class: '!text-center',
        template: true,
        sortable: true
    },
    {
        field: 'actions',
        header: '',
        class: '!text-center',
        frozen: true,
        alignFrozen: 'right',
        button: true,
    }
];