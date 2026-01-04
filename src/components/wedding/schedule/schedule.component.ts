import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimateOnScrollDirective } from '../../../directives/animate-on-scroll.directive';

interface ScheduleItem {
  time: string;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styles: [`
    :host {
      display: block;
    }
    .section-to-animate {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    }

    .section-to-animate.is-visible {
      opacity: 1;
      transform: translateY(0);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AnimateOnScrollDirective],
})
export class ScheduleComponent {
  schedule = input.required<ScheduleItem[]>();
}