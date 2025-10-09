import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private static readonly DEFAULT_TIMEOUT = 5000; // Default timeout for alerts in milliseconds

  constructor(
    private messageService: MessageService
  ) { }

  success(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: message,
      life: AlertService.DEFAULT_TIMEOUT
    });
  }

  error(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: AlertService.DEFAULT_TIMEOUT
    });
  }

  info(message: string) {
    this.messageService.add({
      severity: 'info',
      summary: 'Información',
      detail: message,
      life: AlertService.DEFAULT_TIMEOUT
    });
  }
  warn(message: string) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Advertencia',
      detail: message,
      life: AlertService.DEFAULT_TIMEOUT
    });
  }

  // Alias para compatibilidad
  showError(message: string) {
    this.error(message);
  }
}