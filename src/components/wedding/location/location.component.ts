import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AnimateOnScrollDirective } from '../../../directives/animate-on-scroll.directive';

interface Hotel {
  name: string;
  description: string;
  distance: string;
  link: string;
}

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
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
export class LocationComponent {
  mapUrl = input.required<SafeResourceUrl>();
  mapDirectionsUrl = input.required<string>();
  hotels = input.required<Hotel[]>();
}
