import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconType, NgIcon, provideIcons } from '@ng-icons/core';
import { hugeCheeseCake01, hugeDish02, hugeDrink, hugeMusicNote02 } from '@ng-icons/huge-icons';
import { AnimateOnScrollDirective } from '../../../directives/animate-on-scroll.directive';
const hugeWedding = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="8.5" cy="16.5" r="5.5" />
    <circle cx="15.5" cy="16.5" r="5.5" />
    <path d="M12 9C12 9 16 7.14706 16 4.13889C16 2.95761 15.1579 2 14 2C13.0526 2 12.4211 2.41176 12 3.23529C11.5789 2.41176 10.9474 2 10 2C8.84211 2 8 2.95761 8 4.13889C8 7.14706 12 9 12 9Z" />
</svg>`;

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AnimateOnScrollDirective, NgIcon],
  providers: [provideIcons({ hugeWedding, hugeDrink, hugeDish02, hugeCheeseCake01, hugeMusicNote02 })],
})
export class ScheduleComponent {
  schedule: {
    time: string;
    title: string;
    icon: IconType;
  }[] = [
    {
      time: '16:30',
      title: 'LA CERIMONIA',
      icon: 'hugeWedding',
    },
    {
      time: '18:00',
      title: "L'APERITIVO",
      icon: 'hugeDrink',
    },
    {
      time: '20:00',
      title: 'LA CENA',
      icon: 'hugeDish02',
    },
    {
      time: '22:30',
      title: 'LA TORTA',
      icon: 'hugeCheeseCake01',
    },
    {
      time: '23:00',
      title: 'IL PARTY',
      icon: 'hugeMusicNote02',
    },
  ];
}
