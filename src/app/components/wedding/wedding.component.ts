import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DetailsComponent } from './details/details.component';
import { WeddingFooterComponent } from './footer/footer.component';
import { HeroComponent } from './hero/hero.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RsvpComponent } from './rsvp/rsvp.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { WhereComponent } from './where/where.component';

@Component({
  selector: 'app-wedding',
  templateUrl: './wedding.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    DetailsComponent,
    WhereComponent,
    // AccomodationComponent,
    ScheduleComponent,
    RsvpComponent,
    WeddingFooterComponent,
    // WaveDividerComponent,
  ],
})
export class WeddingComponent {
  // hotels = [
  //   {
  //     name: 'Hotel Giotto Assisi',
  //     description: 'Eleganza nel cuore di Assisi con vista panoramica.',
  //     distance: '15 min in auto',
  //     link: '#',
  //   },
  //   {
  //     name: 'Valle di Assisi Hotel & Resort',
  //     description: 'Resort immerso nel verde con spa e piscina.',
  //     distance: '10 min in auto',
  //     link: '#',
  //   },
  //   {
  //     name: 'Agriturismo Il Girasole',
  //     description: 'Un soggiorno autentico nella campagna umbra.',
  //     distance: '5 min in auto',
  //     link: '#',
  //   },
  //   {
  //     name: 'BV Grand Hotel Assisi',
  //     description: 'Lusso moderno e comfort a pochi passi dalla location.',
  //     distance: '8 min in auto',
  //     link: '#',
  //   },
  // ];
}
