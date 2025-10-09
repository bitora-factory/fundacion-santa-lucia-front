import { FormControl } from "@angular/forms";

export interface FormCreateResident {
    id: FormControl<number | null>
    name: FormControl<string | null>
    dni: FormControl<string | null>
    name2?: FormControl<string | null>
    dni2?: FormControl<string | null>
    accomodation: FormControl<number | null>
    guardian: FormControl<string | null>
    guardianDni: FormControl<string | null>
    address: FormControl<string | null>
    value: FormControl<number | null>
    entryDate: FormControl<Date | null>
    phone: FormControl<string | null>
    months: FormControl<number | null>
    paymentMethod: FormControl<number[] | string | null>
    status: FormControl<number | null>
    residentId: FormControl<number | null>
    relationship: FormControl<number | null>
}

export type ResidentKey = keyof FormCreateResident;
export const RESIDENT_FORM_CONTROL_NAMES: Record<ResidentKey, string> = {
    id: 'id',
    name: 'name',
    dni: 'dni',
    name2: 'name2',
    dni2: 'dni2',
    accomodation: 'accomodation',
    guardian: 'guardian',
    guardianDni: 'guardianDni',
    address: 'address',
    value: 'value',
    entryDate: 'entryDate',
    phone: 'phone',
    months: 'months',
    paymentMethod: 'paymentMethod',
    status: 'status',
    residentId: 'residentId',
    relationship: 'relationship'
}