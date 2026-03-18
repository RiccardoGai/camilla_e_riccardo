import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { hugeGuestHouse, hugeHome01, hugeHotel01 } from '@ng-icons/huge-icons';
import { AnimateOnScrollDirective } from '../../../directives/animate-on-scroll.directive';

interface Hotel {
  name: string;
  link: string;
  icon: string;
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
  imports: [CommonModule, AnimateOnScrollDirective, NgIcon],
  providers: [provideIcons({ hugeHotel01, hugeGuestHouse, hugeHome01 })],
})
export class AccomodationComponent {
  hotels = [
    {
      name: 'Re Artù',
      link: 'https://reartuassisi.it/',
      icon: 'hugeHotel01',
    },
    {
      name: 'Casale Merlino',
      link: 'https://reartuassisi.it/ospitalita/merlino-il-casale',
      icon: 'hugeGuestHouse',
    },
    {
      name: 'Antica Fonte',
      link: 'https://www.anticafonteassisi.com/',
      icon: 'hugeHome01',
    },
  ];
}
