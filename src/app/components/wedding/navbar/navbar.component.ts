
import { ChangeDetectionStrategy, Component, inject, signal, DOCUMENT } from '@angular/core';

import { LogoComponent } from '../../logo/logo.component';

interface NavLink {
  href: string;
  label: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
    `
      :host {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 50;
        transition: transform 0.3s ease-in-out;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LogoComponent],
})
export class NavbarComponent {
  private document = inject(DOCUMENT);

  isVisible = signal(true);
  isMobileMenuOpen = signal(false);

  navLinks: NavLink[] = [
    { href: '#details', label: 'Il Nostro Giorno' },
    { href: '#rsvp', label: 'RSVP e Lista Nozze' },
    { href: '#where', label: 'Come Arrivare' },
    { href: '#schedule', label: 'Il Programma' },
    //{ href: '#accomodation', label: 'Dove Soggiornare' },
  ];

  toggleMenu() {
    this.isMobileMenuOpen.update((v) => !v);
  }

  scrollTo(event: Event, id: string) {
    event.preventDefault();
    this.isMobileMenuOpen.set(false); // Chiudi menu dopo il click

    const element = this.document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
