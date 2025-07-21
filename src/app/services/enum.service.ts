import { Injectable } from '@angular/core';
import { EnumInterface } from '../models/interfaces/enum.interface';

@Injectable({
  providedIn: 'root'
})
export class EnumService {

  constructor() { }

  public accomodation: EnumInterface[] = [
    { id: 1, name: 'INDIVIDUAL' },
    { id: 2, name: 'MULTIPLE' },
  ];
  public payment: EnumInterface[] = [
    { id: 1, name: 'EFECTIVO' },
    { id: 2, name: 'BANCOLOMBIA' },
    { id: 3, name: 'CAJA SOCIAL' },
  ];

  public status: EnumInterface[] = [
    { id: 1, name: 'ACTIVO', class: 'status active' },
    { id: 2, name: 'INACTIVO', class: 'status inactive' },
    { id: 3, name: 'FALLECIDO', class: 'status deceased' },
  ];

  public getEnum(type: 'accomodation' | 'payment' | 'status'): EnumInterface[] {
    switch (type) {
      case 'accomodation':
        return this.accomodation;
      case 'payment':
        return this.payment;
      case 'status':
        return this.status;
      default:
        return [];
    }
  }

  public getEnumName(type: 'accomodation' | 'payment' | 'status', id: number): string {
    const enumList = this.getEnum(type);
    const enumItem = enumList.find(item => item.id === id);
    return enumItem ? enumItem.name : 'DESCONOCIDO';
  }

  public getEnumClass(type: 'accomodation' | 'payment' | 'status', id: number): string {
    const enumList = this.getEnum(type);
    const enumItem = enumList.find(item => item.id === id);
    return enumItem ? enumItem.class || '' : '';
  }


}
