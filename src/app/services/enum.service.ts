import { Injectable } from '@angular/core';
import { EnumInterface } from '../models/interfaces/enum.interface';
import { EnumType } from '../models/resident.model';

@Injectable({
  providedIn: 'root'
})
export class EnumService {

  constructor() { }

  private accomodation: EnumInterface[] = [
    { id: 1, name: 'INDIVIDUAL' },
    { id: 2, name: 'MULTIPLE' },
    { id: 3, name: 'COMPARTIDA' },
  ];
  private payment: EnumInterface[] = [
    { id: 1, name: 'EFECTIVO' },
    { id: 2, name: 'BANCOLOMBIA' },
    { id: 3, name: 'CAJA SOCIAL' },
  ];

  private status: EnumInterface[] = [
    { id: 1, name: 'ACTIVO', class: 'status active' },
    { id: 2, name: 'INACTIVO', class: 'status inactive' },
    { id: 3, name: 'FALLECIDO', class: 'status deceased' },
  ];

  public getEnum(type: EnumType): EnumInterface[] {
    switch (type) {
      case 'accomodation':
        return this.accomodation;
      case 'paymentMethod':
        return this.payment;
      case 'status':
        return this.status;
      default:
        return [];
    }
  }

  public getEnumName(type: EnumType, id: number | null | undefined): string {
    if (!id && id !== 0) return 'DESCONOCIDO';

    const enumList = this.getEnum(type);
    const enumItems = enumList.filter(item => item.id === Number(id));
    return enumItems.length > 0 ? enumItems[0].name : 'DESCONOCIDO';
  }

  public getEnumClass(type: EnumType, id: number | null | undefined): string {
    if (!id && id !== 0) return '';

    const enumList = this.getEnum(type);
    const enumItem = enumList.find(item => item.id === Number(id));
    return enumItem ? enumItem.class || '' : '';
  }

  /**
   * Obtiene los nombres de métodos de pago desde un string que puede contener múltiples IDs
   * Ejemplo: "1" → "Efectivo", "1/3" → "Efectivo/Caja Social"
   */
  public getPaymentMethodNames(paymentMethodIds: string | number | null | undefined): string {
    if (!paymentMethodIds) return 'DESCONOCIDO';

    // Convertir a string si no lo es
    let idsString = String(paymentMethodIds).trim();

    // Limpieza especial para el formato {"1","2"}
    if (idsString.startsWith('{') && idsString.endsWith('}')) {
      idsString = idsString
        .replace(/[{}"]/g, '') // elimina llaves y comillas
        .replace(/\s/g, '');   // elimina espacios
    }

    // Separar por '/' o ',' según el caso
    const ids = idsString
      .split(/[/,]/)
      .map(id => parseInt(id.trim()))
      .filter(id => !isNaN(id));

    if (ids.length === 0) return 'DESCONOCIDO';

    const names = ids.map(id => {
      const enumName = this.getEnumName('paymentMethod', id);
      return this.formatEnumName(enumName);
    });

    return names.join(' / ');
  }


  /**
   * Formatea el nombre del enum para mejor presentación
   */
  private formatEnumName(str: string | null | undefined): string {
    if (!str || typeof str !== 'string') return 'DESCONOCIDO';

    return str.toLowerCase().split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  /**
   * Convierte un string o arreglo de IDs de métodos de pago a un array de números.
   * Ejemplos:
   *   "1/2/3"        → [1, 2, 3]
   *   "1,2,3"        → [1, 2, 3]
   *   '{"1","2"}'    → [1, 2]
   *   [1, 2, 3]      → [1, 2, 3]
   *   null | undefined → []
   */
  public parsePaymentMethodIds(paymentMethodIds: string | number[] | null | undefined): number[] {
    if (!paymentMethodIds) return [];

    // Si ya es un array de números, devolvemos una copia limpia
    if (Array.isArray(paymentMethodIds)) {
      return paymentMethodIds
        .map(id => Number(id))
        .filter(id => !isNaN(id));
    }

    // Convertimos a string para procesar
    let idsString = String(paymentMethodIds)
      .replace(/[{}"]/g, '')  // elimina { } y comillas
      .trim();

    // Separadores posibles: '/', ',', ';', espacio
    const parts = idsString.split(/[/,; ]+/);

    return parts
      .map(id => Number(id.trim()))
      .filter(id => !isNaN(id));
  }


  /**
   * Convierte un array de números a un string de IDs de métodos de pago
   * Ejemplo: [1, 3] → "1/3"
   */
  public formatPaymentMethodIds(ids: number[]): string {
    return ids.join('/');
  }


}
