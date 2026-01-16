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
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AnimateOnScrollDirective, NgIcon],
  providers: [provideIcons({ hugeCalendar04, hugeLocation01, hugeMail01 })],
})
export class DetailsComponent {}
