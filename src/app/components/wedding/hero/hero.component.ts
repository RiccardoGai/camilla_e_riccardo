import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styles: [
    `
      header {
        /* Low-Quality Image Placeholder (LQIP) */
        /* This is a very small, blurred version that loads instantly */
        background-image: url('https://picsum.photos/id/1043/20/15?blur=5');
      }
      .hero-image {
        object-fit: cover; /* Equivalent to bg-cover */
        /* No z-index is needed here; let DOM order handle the initial stacking */
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
})
export class HeroComponent {}
