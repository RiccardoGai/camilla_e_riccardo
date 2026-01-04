import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { HeroComponent } from './hero/hero.component';
import { DetailsComponent } from './details/details.component';
import { WhereComponent } from './where/where.component';
import { AccomodationComponent } from './accomodation/accomodation.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { RsvpComponent } from './rsvp/rsvp.component';
import { WeddingFooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-wedding',
  templateUrl: './wedding.component.html',
  styles: [`
    :host {
      display: block;
      background-color: #f1ebe5;
      color: #5d5d5d;
    }
  `],
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
  mapDirectionsUrl = 'https://www.google.com/maps/dir/?api=1&destination=Colcaprile,+Strada+Comunale+Santa+Croce,+06081+Assisi+PG';

  hotels = [
    { name: 'Hotel Giotto Assisi', description: 'Eleganza nel cuore di Assisi con vista panoramica.', distance: '15 min in auto', link: '#' },
    { name: 'Valle di Assisi Hotel & Resort', description: 'Resort immerso nel verde con spa e piscina.', distance: '10 min in auto', link: '#' },
    { name: 'Agriturismo Il Girasole', description: 'Un soggiorno autentico nella campagna umbra.', distance: '5 min in auto', link: '#' },
    { name: 'BV Grand Hotel Assisi', description: 'Lusso moderno e comfort a pochi passi dalla location.', distance: '8 min in auto', link: '#' }
  ];

  schedule = [
    {
      time: '16:30',
      title: 'LA CERIMONIA',
      description: '',
      // Icona: Anelli nuziali
      icon: 'M13.5 10.5a3 3 0 1 0-6 0v.5h-1a3 3 0 1 0 0 6h1v.5a3 3 0 1 0 6 0v-.5h1a3 3 0 1 0 0-6h-1v-.5z M8.5 11v.5h4v-.5a2 2 0 1 0-4 0z'
    },
    {
      time: '18:00',
      title: "L'APERITIVO",
      description: '',
      // Icona: Calici (Toast)
      icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
    },
    {
      time: '20:00',
      title: 'LA CENA',
      description: '',
      // Icona: Posate e Piatto
      icon: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM6 12h12 M12 6v12'
    },
    {
      time: '22:30',
      title: 'LA TORTA',
      description: '',
      // Icona: Torta (Cake)
      icon: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M8.5 13h7 M12 13v4 M12 9v1'
    },
    {
      time: '23:00',
      title: 'IL PARTY',
      description: '',
      // Icona: Note musicali
      icon: 'M9 18V5l12-2v13 M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0 M21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0'
    }
  ];

  constructor() {
    const url = 'https://maps.google.com/maps?q=Colcaprile%20Strada%20Comunale%20Santa%20Croce%2C%2006081%20Assisi&t=&z=15&ieUTF8&iwloc=&output=embed';
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}