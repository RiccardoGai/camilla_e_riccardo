
import { ChangeDetectionStrategy, Component } from '@angular/core';

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
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NavbarComponent,
    HeroComponent,
    DetailsComponent,
    WhereComponent,
    AccomodationComponent,
    ScheduleComponent,
    RsvpComponent,
    WeddingFooterComponent
],
})
export class WeddingComponent {}
