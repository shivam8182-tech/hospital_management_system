import { Directive, HostListener, ElementRef, inject } from '@angular/core';

/** Formats a 10-digit phone input as (555) 123-4567. */
@Directive({
  selector: '[appUsPhoneFormat]',
  standalone: true
})
export class UsPhoneFormatDirective {
  private readonly element = inject(ElementRef<HTMLInputElement>);

  @HostListener('input')
  format(): void {
    const raw = this.element.nativeElement.value.replace(/\D/g, '').slice(0, 10);
    let formatted = raw;
    if (raw.length > 6) {
      formatted = `(${raw.slice(0, 3)}) ${raw.slice(3, 6)}-${raw.slice(6)}`;
    } else if (raw.length > 3) {
      formatted = `(${raw.slice(0, 3)}) ${raw.slice(3)}`;
    }
    this.element.nativeElement.value = formatted;
  }
}