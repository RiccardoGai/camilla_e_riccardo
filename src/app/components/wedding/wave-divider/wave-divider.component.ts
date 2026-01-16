import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-wave-divider',
  standalone: true,
  template: `
    <div class="wave-divider" [class]="variantClass()" [class.wave-divider--flip]="flip()" aria-hidden="true">
      <svg viewBox="0 0 1440 320" preserveAspectRatio="none" role="presentation">
        <path
          fill="currentColor"
          d="M0,180 C240,220 480,140 720,180 C960,220 1200,140 1440,180 V320 H0 Z"
        ></path>
      </svg>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaveDividerComponent {
  variant = input<'beige' | 'green'>('beige');
  flip = input<boolean>(false);

  variantClass = computed(() => (this.variant() === 'green' ? 'wave-divider--green' : 'wave-divider--beige'));
}
