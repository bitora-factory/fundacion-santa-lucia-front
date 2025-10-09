export interface ResidentModel {
    id: number | null;
    residentId: number | null;
    name: string | null;
    dni: string | null;
    name2?: string | null;
    dni2?: string | null;
    accomodation: number | null;
    guardian: string | null;
    guardianDni: string | null;
    address: string | null;
    value: number | null;
    entryDate: Date | null;
    phone: string | null;
    months?: number | null;
    paymentMethod: number[] | string | null;  // Cambiado a string para soportar "1" o "1/3"
    paymentFormatted?: string | null; // Propiedad computada para filtros
    status: number | null;
    relationship: number | null;
}

export type EnumType = 'accomodation' | 'paymentMethod' | 'status';
