import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  templateUrl: './logo.component.html',
  styles: [
    `
      :host {
        display: inline-flex;
        line-height: 0;
      }

      svg {
        display: block;
        width: auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoComponent {
  readonly fillOpacity = input(0.95);
  readonly ariaLabel = input('Logo Camilla e Riccardo');
  readonly size = input('2.5rem');
}
