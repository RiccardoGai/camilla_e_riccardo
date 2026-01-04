import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class CountdownComponent implements OnInit, OnDestroy {
  private readonly weddingDate = new Date('2026-06-20T16:30:00').getTime();
  private intervalId?: number;

  days = signal(0);
  hours = signal(0);
  minutes = signal(0);
  seconds = signal(0);

  ngOnInit(): void {
    this.updateCountdown();
    this.intervalId = window.setInterval(() => this.updateCountdown(), 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private updateCountdown(): void {
    const now = new Date().getTime();
    const distance = this.weddingDate - now;

    if (distance < 0) {
      this.days.set(0);
      this.hours.set(0);
      this.minutes.set(0);
      this.seconds.set(0);
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
      return;
    }

    this.days.set(Math.floor(distance / (1000 * 60 * 60 * 24)));
    this.hours.set(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    this.minutes.set(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
    this.seconds.set(Math.floor((distance % (1000 * 60)) / 1000));
  }
}
