import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService, UserRole } from '../../core/services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  section: string;
  route?: string;
}

interface TimeEntry {
  date: string;
  clockIn: string;
  clockOut: string | null;
}

interface Appointment {
  id: number;
  date: string;
  time: string;
  provider: string;
  status: 'Booked';
}

interface CalendarDay {
  date: number;
  key: string;
  inMonth: boolean;
  isToday: boolean;
  appointmentCount: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly role: UserRole = this.auth.getRole() ?? 'patient';
  readonly roleName = this.role.charAt(0).toUpperCase() + this.role.slice(1);
  readonly menuItems: MenuItem[] = this.createMenu(this.role);
  readonly todayKey = this.dateKey(new Date());
  readonly weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  readonly providerNames = ['Dr. Maya Chen', 'Dr. Alex Morgan', 'Dr. Priya Shah'];

  selectedMenu = this.menuItems[0].section;
  calendarMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  selectedDate = this.todayKey;
  selectedProvider = this.providerNames[0];
  selectedTime = '09:00';
  bookingMessage = '';
  private readonly timeEntriesKey = 'hms_timesheet_entries';
  private readonly appointmentsKey = 'hms_patient_appointments';
  timeEntries: TimeEntry[] = this.loadEntries<TimeEntry>(this.timeEntriesKey);
  appointments: Appointment[] = this.loadEntries<Appointment>(this.appointmentsKey);

  get monthLabel(): string {
    return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(this.calendarMonth);
  }

  get selectedDateLabel(): string {
    return new Intl.DateTimeFormat('en', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(this.parseDateKey(this.selectedDate));
  }

  get calendarDays(): CalendarDay[] {
    const firstDay = new Date(this.calendarMonth.getFullYear(), this.calendarMonth.getMonth(), 1);
    const mondayOffset = (firstDay.getDay() + 6) % 7;
    const gridStart = new Date(firstDay);
    gridStart.setDate(firstDay.getDate() - mondayOffset);

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + index);
      const key = this.dateKey(date);
      return {
        date: date.getDate(),
        key,
        inMonth: date.getMonth() === this.calendarMonth.getMonth(),
        isToday: key === this.todayKey,
        appointmentCount: this.appointments.filter(appointment => appointment.date === key).length
      };
    });
  }

  get todaysTimeEntry(): TimeEntry | undefined {
    return this.timeEntries.find(entry => entry.date === this.todayKey);
  }

  get hoursWorkedToday(): string {
    const entry = this.todaysTimeEntry;
    if (!entry?.clockIn) return '0h 00m';
    const start = new Date(entry.clockIn).getTime();
    const end = entry.clockOut ? new Date(entry.clockOut).getTime() : Date.now();
    const minutes = Math.max(0, Math.floor((end - start) / 60000));
    return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}m`;
  }

  get selectedDateAppointments(): Appointment[] {
    return this.appointments
      .filter(appointment => appointment.date === this.selectedDate)
      .sort((a, b) => a.time.localeCompare(b.time));
  }

  get upcomingAppointments(): Appointment[] {
    return this.appointments
      .filter(appointment => appointment.date >= this.todayKey)
      .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  }

  isAdminLanding(): boolean {
    return this.role === 'admin' && this.router.url === '/dashboard';
  }

  selectMenu(item: MenuItem): void {
    if (item.route) {
      this.router.navigate([item.route]);
      return;
    }
    this.selectedMenu = item.section;
  }

  isMenuActive(item: MenuItem): boolean {
    return item.route
      ? this.router.url.startsWith(item.route)
      : this.selectedMenu === item.section;
  }

  clockIn(): void {
    if (this.todaysTimeEntry) return;
    this.timeEntries = [
      { date: this.todayKey, clockIn: new Date().toISOString(), clockOut: null },
      ...this.timeEntries
    ];
    this.saveEntries(this.timeEntriesKey, this.timeEntries);
  }

  clockOut(): void {
    const entry = this.todaysTimeEntry;
    if (!entry || entry.clockOut) return;
    this.timeEntries = this.timeEntries.map(item =>
      item === entry ? { ...item, clockOut: new Date().toISOString() } : item
    );
    this.saveEntries(this.timeEntriesKey, this.timeEntries);
  }

  changeMonth(offset: number): void {
    this.calendarMonth = new Date(
      this.calendarMonth.getFullYear(),
      this.calendarMonth.getMonth() + offset,
      1
    );
  }

  selectDate(day: CalendarDay): void {
    this.selectedDate = day.key;
    this.bookingMessage = '';
    if (!day.inMonth) {
      this.calendarMonth = new Date(
        this.parseDateKey(day.key).getFullYear(),
        this.parseDateKey(day.key).getMonth(),
        1
      );
    }
  }

  bookAppointment(): void {
    this.bookingMessage = '';
    if (this.selectedDate < this.todayKey) {
      this.bookingMessage = 'Choose today or a future date for your appointment.';
      return;
    }
    if (this.selectedDateAppointments.some(item => item.time === this.selectedTime)) {
      this.bookingMessage = 'You already have an appointment at that time. Choose another slot.';
      return;
    }

    this.appointments = [
      ...this.appointments,
      {
        id: Date.now(),
        date: this.selectedDate,
        time: this.selectedTime,
        provider: this.selectedProvider,
        status: 'Booked'
      }
    ];
    this.saveEntries(this.appointmentsKey, this.appointments);
    this.bookingMessage = 'Appointment booked. It is now listed in My appointments.';
  }

  formatTime(value: string | null): string {
    return value
      ? new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date(value))
      : '—';
  }

  formatAppointmentDate(value: string): string {
    return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' })
      .format(this.parseDateKey(value));
  }

  cancelAppointment(appointment: Appointment): void {
    this.appointments = this.appointments.filter(item => item.id !== appointment.id);
    this.saveEntries(this.appointmentsKey, this.appointments);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  private createMenu(role: UserRole): MenuItem[] {
    if (role === 'admin') {
      return [
        { label: 'Overview', icon: '⌂', section: 'overview' },
        { label: 'Patients', icon: '♡', section: 'patients', route: '/dashboard/patient' },
        { label: 'Staff', icon: '♧', section: 'staff', route: '/dashboard/staff' },
        { label: 'Providers', icon: '✚', section: 'providers', route: '/dashboard/provider' },
        { label: 'Billing', icon: '$', section: 'billing', route: '/dashboard/biller' }
      ];
    }
    if (role === 'staff') {
      return [
        { label: 'My dashboard', icon: '⌂', section: 'overview' },
        { label: 'Time sheet', icon: '◷', section: 'timesheet' },
        { label: 'My shifts', icon: '▦', section: 'shifts' },
        { label: 'My profile', icon: '♙', section: 'profile' }
      ];
    }
    if (role === 'provider') {
      return [
        { label: 'Overview', icon: '⌂', section: 'overview' },
        { label: 'Appointments', icon: '◷', section: 'appointments' },
        { label: 'Patient list', icon: '♡', section: 'patients' },
        { label: 'My schedule', icon: '▦', section: 'schedule' }
      ];
    }
    return [
      { label: 'My dashboard', icon: '⌂', section: 'overview' },
      { label: 'Book appointment', icon: '+', section: 'book' },
      { label: 'My appointments', icon: '◷', section: 'appointments' },
      { label: 'My health', icon: '♡', section: 'health' }
    ];
  }

  private loadEntries<T>(key: string): T[] {
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      throw new Error(`Stored dashboard data for "${key}" is not a list.`);
    }
    return parsed as T[];
  }

  private saveEntries<T>(key: string, value: T[]): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  private dateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private parseDateKey(value: string): Date {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
}
