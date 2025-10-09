import { TableInterface } from "../models/interfaces/table.interface";

export const RESIDENT_COLUMNS: TableInterface[] = [
    { 
        field: 'residentId', 
        header: 'No', 
        class: '!text-center',
        filterType: 'text',
        matchMode: 'startsWith',
        placeholder: 'Filtrar No.'
    },
    { 
        field: 'name', 
        header: 'NOMBRE', 
        class: '',
        filterType: 'text',
        matchMode: 'contains',
        placeholder: 'Filtrar Nombre'
    },
    { 
        field: 'dni', 
        header: 'CÉDULA', 
        class: '',
        filterType: 'numeric',
        matchMode: 'equals',
        placeholder: 'Filtrar Cédula'
    },
    { 
        field: 'accomodation', 
        header: 'ACOMODACIÓN', 
        class: '!text-center',
        filterType: 'text',
        matchMode: 'contains',
        placeholder: 'Filtrar Acomodación'
    },
    { 
        field: 'guardian', 
        header: 'ACUDIENTE', 
        class: '',
        filterType: 'text',
        matchMode: 'contains',
        placeholder: 'Filtrar Acudiente'
    },
    { 
        field: 'guardianDni', 
        header: 'CC_ACUDIENTE', 
        class: '',
        filterType: 'numeric',
        matchMode: 'equals',
        placeholder: 'Filtrar CC Acudiente'
    },
    { 
        field: 'address', 
        header: 'DIRECCIÓN', 
        class: '',
        filterType: 'text',
        matchMode: 'contains',
        placeholder: 'Filtrar Dirección'
    },
    { 
        field: 'phone', 
        header: 'TELÉFONO', 
        class: '',
        filterType: 'text',
        matchMode: 'contains',
        placeholder: 'Filtrar Teléfono'
    },
    { 
        field: 'value', 
        header: 'VALOR UNITARIO', 
        class: '!text-center',
        filterType: 'numeric',
        matchMode: 'equals',
        placeholder: 'Filtrar Valor Unitario'
    },
    { 
        field: 'paymentMethod', 
        header: 'FORMA PAGO', 
        class: '!text-center',
        filterType: 'text',
        matchMode: 'contains',
        placeholder: 'Filtrar Forma de Pago'
    },
    { 
        field: 'entryDate', 
        header: 'FECHA INGRESO', 
        class: '!text-center',
        filterType: 'date',
        matchMode: 'equals',
        placeholder: 'Filtrar Fecha de Ingreso'
    },
    { 
        field: 'months', 
        header: 'MESES', 
        class: '!text-center',
        filterType: 'numeric',
        matchMode: 'equals',
        placeholder: 'Filtrar Meses'
    },
    { 
        field: 'status', 
        header: 'ESTADO', 
        class: '!text-center',
        template: true
    },
    { 
        field: 'actions', 
        header: 'ACCIONES', 
        class: '!text-center', 
        frozen: true,
        alignFrozen: 'right',
        button: true
    }
];