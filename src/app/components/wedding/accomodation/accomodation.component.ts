import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
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
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AnimateOnScrollDirective],
})
export class AccomodationComponent {
  hotels = input.required<Hotel[]>();
}
