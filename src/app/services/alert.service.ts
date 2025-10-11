import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  // private readonly DEFAULT_TIMEOUT = 5000;

  constructor(
    private messageService: MessageService
  ) { }

  success(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: message,
      life: 3000
    });
  }

  error(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 9000
      // sticky: true 
    });
  }

  info(message: string) {
    this.messageService.add({
      severity: 'info',
      summary: 'Información',
      detail: message,
      life: 9000
      // sticky: true 
    });
  }

  warn(message: string) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Advertencia',
      detail: message,
      life: 9000
      // sticky: true 
    });
  }

  // Alias para compatibilidad
  showError(message: string) {
    this.error(message);
  }
}