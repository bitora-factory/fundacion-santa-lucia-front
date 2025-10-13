import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-overlay" *ngIf="loadingService.isLoading">
      <div class="loading-container">
        <div class="loading-spinner">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        </div>
        <div class="loading-text">
          {{ loadingService.loadingMessage }}
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
      min-width: 220px;
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
export class LoadingComponent {
  constructor(public loadingService: LoadingService) {}
}
