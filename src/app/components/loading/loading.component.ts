import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-overlay" *ngIf="loading$ | async">
      <div class="loading-container">
        <div class="loading-spinner">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        </div>
        <div class="loading-text">
          <div *ngIf="message">{{ message }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    .loading-container {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      min-width: 200px;
    }

    .loading-spinner {
      margin-bottom: 1rem;
      color: var(--primary-color);
    }

    .loading-text {
      font-size: 1.1rem;
      color: #333;
      font-weight: 500;
    }
  `]
})
export class LoadingComponent implements OnInit {
  loading$: Observable<boolean>;
  message: string = 'Cargando...';

  constructor(private loadingService: LoadingService) {
    this.loading$ = this.loadingService.loading$;

    setTimeout(() => {
      this.message = 'Estamos obteniendo los datos, esto puede tardar unos segundos...';
    }, 3000);
  }

  ngOnInit(): void { }
}
