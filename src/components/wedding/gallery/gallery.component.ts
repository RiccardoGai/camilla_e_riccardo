import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimateOnScrollDirective } from '../../../directives/animate-on-scroll.directive';

interface Photo {
  src: string;
  alt: string;
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styles: [`
    :host { display: block; }
    .section-to-animate {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    }
    .section-to-animate.is-visible {
      opacity: 1;
      transform: translateY(0);
    }
    .grid-gallery {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AnimateOnScrollDirective],
})
export class GalleryComponent {
  photos = input.required<Photo[]>();
}
