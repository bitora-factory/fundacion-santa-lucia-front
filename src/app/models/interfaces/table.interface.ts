export interface TableInterface {
    field: string;
    header: string;
    sortable?: boolean;
    filter?: boolean;
    filterMatchMode?: string;
    class?: string;
    frozen?: boolean;
    filterType?: 'text' | 'dropdown' | 'calendar' | 'numeric' | 'boolean' | 'date';
    placeholder?: string;
    matchMode?: string;
    template?: boolean;
    alignFrozen?: 'left' | 'right';
    button?: boolean;
}