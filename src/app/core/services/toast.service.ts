import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: number;
  type: 'success' | 'error';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly messagesSubject = new BehaviorSubject<ToastMessage[]>([]);
  readonly messages$ = this.messagesSubject.asObservable();
  private nextId = 0;
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();

  success(message: string): void {
    this.show('success', message);
  }

  error(message: string): void {
    this.show('error', message);
  }

  dismiss(id: number): void {
    const timer = this.timers.get(id);
    if (timer) clearTimeout(timer);
    this.timers.delete(id);
    this.messagesSubject.next(this.messagesSubject.value.filter(item => item.id !== id));
  }

  private show(type: ToastMessage['type'], message: string): void {
    const id = ++this.nextId;
    this.messagesSubject.next([...this.messagesSubject.value, { id, type, message }]);
    this.timers.set(id, setTimeout(() => this.dismiss(id), 5000));
  }
}
