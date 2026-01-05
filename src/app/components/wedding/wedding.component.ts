import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { AccomodationComponent } from './accomodation/accomodation.component';
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
        background-color: #f1ebe5;
        color: #5d5d5d;
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
    AccomodationComponent,
    ScheduleComponent,
    RsvpComponent,
    WeddingFooterComponent,
  ],
})
export class WeddingComponent {
  // FIX: Explicitly type injected DomSanitizer to resolve 'unknown' type error.
  private sanitizer: DomSanitizer = inject(DomSanitizer);

  mapUrl: SafeResourceUrl;
  mapDirectionsUrl =
    'https://www.google.com/maps/dir/?api=1&destination=Colcaprile,+Strada+Comunale+Santa+Croce,+06081+Assisi+PG';

  hotels = [
    {
      name: 'Hotel Giotto Assisi',
      description: 'Eleganza nel cuore di Assisi con vista panoramica.',
      distance: '15 min in auto',
      link: '#',
    },
    {
      name: 'Valle di Assisi Hotel & Resort',
      description: 'Resort immerso nel verde con spa e piscina.',
      distance: '10 min in auto',
      link: '#',
    },
    {
      name: 'Agriturismo Il Girasole',
      description: 'Un soggiorno autentico nella campagna umbra.',
      distance: '5 min in auto',
      link: '#',
    },
    {
      name: 'BV Grand Hotel Assisi',
      description: 'Lusso moderno e comfort a pochi passi dalla location.',
      distance: '8 min in auto',
      link: '#',
    },
  ];

  constructor() {
    const url =
      'https://maps.google.com/maps?q=Colcaprile%20Strada%20Comunale%20Santa%20Croce%2C%2006081%20Assisi&t=&z=15&ieUTF8&iwloc=&output=embed';
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
