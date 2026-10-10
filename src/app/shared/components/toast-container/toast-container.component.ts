import { AsyncPipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [AsyncPipe, NgClass],
  template: `
    <div class="toast-stack" aria-live="polite" aria-atomic="false">
      @for (toast of toastService.messages$ | async; track toast.id) {
        <div class="toast" [ngClass]="toast.type" role="status">
          <span class="toast-icon" aria-hidden="true">{{ toast.type === 'success' ? '✓' : '!' }}</span>
          <span class="toast-message">{{ toast.message }}</span>
          <button type="button" class="toast-close" aria-label="Dismiss message" (click)="toastService.dismiss(toast.id)">×</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-stack { position: fixed; z-index: 2000; top: 20px; right: 20px; display: grid; gap: 10px; width: min(390px, calc(100vw - 32px)); }
    .toast { display: flex; align-items: flex-start; gap: 11px; padding: 14px 15px; border: 1px solid; border-radius: 10px; background: #fff; box-shadow: 0 12px 32px #172b3c24; animation: toast-in .18s ease-out; }
    .toast.success { border-color: #b8e2c7; color: #22623d; }
    .toast.error { border-color: #f0c4c0; color: #9f2e25; }
    .toast-icon { width: 22px; height: 22px; display: grid; place-items: center; flex: none; border-radius: 50%; background: currentColor; color: #fff; font-weight: 800; font-size: 13px; }
    .toast-message { flex: 1; padding-top: 2px; font-size: 13px; line-height: 1.45; }
    .toast-close { border: 0; background: transparent; color: #718096; font-size: 20px; line-height: 1; cursor: pointer; }
    @keyframes toast-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
    @media (prefers-reduced-motion: reduce) { .toast { animation: none; } }
  `]
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);
}
