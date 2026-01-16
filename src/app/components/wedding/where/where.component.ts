import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AnimateOnScrollDirective } from '../../../directives/animate-on-scroll.directive';

@Component({
  selector: 'app-where',
  templateUrl: './where.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AnimateOnScrollDirective],
})
export class WhereComponent {
  private sanitizer: DomSanitizer = inject(DomSanitizer);

  mapUrl: SafeResourceUrl;
  mapDirectionsUrl =
    'https://www.google.com/maps/dir/?api=1&destination=Colcaprile,+Strada+Comunale+Santa+Croce,+06081+Assisi+PG';

  constructor() {
    const url =
      'https://maps.google.com/maps?q=Colcaprile%20Strada%20Comunale%20Santa%20Croce%2C%2006081%20Assisi&t=&z=15&ieUTF8&iwloc=&output=embed';
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
