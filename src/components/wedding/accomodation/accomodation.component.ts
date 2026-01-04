import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimateOnScrollDirective } from '../../../directives/animate-on-scroll.directive';

interface Hotel {
  name: string;
  description: string;
  distance: string;
  link: string;
}

@Component({
  selector: 'app-accomodation',
  templateUrl: './accomodation.component.html',
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
export class AccomodationComponent {
  hotels = input.required<Hotel[]>();
}