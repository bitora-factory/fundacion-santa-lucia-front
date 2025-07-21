export interface TableInterface {
    field: string;
    header: string;
    sortable?: boolean;
    filter?: boolean;
    filterMatchMode?: string;
    class?: string;
    frozen?: boolean;
}