import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<{ isLoading: boolean; message: string }>({ isLoading: false, message: '' });
  public loading$ = this.loadingSubject.asObservable();
  private activeRequests = 0;
  private messageTimer?: any;

  show(message: string = 'Cargando...'): void {
    this.activeRequests++;
    if (this.activeRequests === 1) {
      this.loadingSubject.next({ isLoading: true, message });

      // Cambiar mensaje si el loading dura más de 3 s
      this.messageTimer = setTimeout(() => {
        this.loadingSubject.next({
          isLoading: true,
          message: 'Estamos obteniendo los datos, esto puede tardar unos segundos...'
        });
      }, 3000);
    }
  }

  hide(): void {
    // setTimeout(() => {
      this.activeRequests = Math.max(0, this.activeRequests - 1);
      if (this.activeRequests === 0) {
        clearTimeout(this.messageTimer);
        this.loadingSubject.next({ isLoading: false, message: '' });
      }

    // }, 10000);
  }

  get isLoading(): boolean {
    return this.loadingSubject.value.isLoading;
  }

  get loadingMessage(): string {
    return this.loadingSubject.value.message;
  }
}
