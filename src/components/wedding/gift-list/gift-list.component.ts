import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimateOnScrollDirective } from '../../../directives/animate-on-scroll.directive';

@Component({
  selector: 'app-gift-list',
  templateUrl: './gift-list.component.html',
  styles: [`
    :host {
      display: block;
    }
    .section-to-animate {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    }

    .section-to-animate.is-visible {
      opacity: 1;
      transform: translateY(0);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AnimateOnScrollDirective],
})
export class GiftListComponent {
  iban = input.required<string>();
  copyState = signal<'idle' | 'copied'>('idle');

  copyIban(): void {
    if (!this.iban() || !navigator.clipboard) {
      return;
    }

    navigator.clipboard.writeText(this.iban()).then(() => {
      this.copyState.set('copied');
      setTimeout(() => {
        this.copyState.set('idle');
      }, 3000);
    }).catch(err => {
      console.error('Failed to copy IBAN: ', err);
    });
  }
}
