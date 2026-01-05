import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { hugeCalendar04, hugeLocation01, hugeMail01 } from '@ng-icons/huge-icons';
import { AnimateOnScrollDirective } from '../../../directives/animate-on-scroll.directive';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styles: [
    `
      :host {
        display: block;
      }
      .section-to-animate {
        opacity: 0;
        transform: translateY(20px);
        transition:
          opacity 0.8s ease-out,
          transform 0.8s ease-out;
      }

      .section-to-animate.is-visible {
        opacity: 1;
        transform: translateY(0);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AnimateOnScrollDirective, NgIcon],
  providers: [provideIcons({ hugeCalendar04, hugeLocation01, hugeMail01 })],
})
export class DetailsComponent {}
