import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnimateOnScrollDirective } from '../../../directives/animate-on-scroll.directive';
import { GeminiService } from '../../../services/gemini.service';

@Component({
  selector: 'app-dedica',
  templateUrl: './dedica.component.html',
  styles: [`
    :host { display: block; }
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
  imports: [CommonModule, FormsModule, AnimateOnScrollDirective],
})
export class DedicaComponent {
  private geminiService = inject(GeminiService);

  keywords = signal('');
  generatedDedication = signal('');
  status = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  copyState = signal<'idle' | 'copied'>('idle');

  async generateDedication() {
    if (!this.keywords().trim()) return;

    this.status.set('loading');
    this.generatedDedication.set('');
    this.copyState.set('idle');
    try {
      const result = await this.geminiService.generateDedication(this.keywords());
      this.generatedDedication.set(result);
      this.status.set('success');
    } catch (error) {
      this.status.set('error');
      this.generatedDedication.set('Si è verificato un errore. Riprova più tardi.');
    }
  }

  copyDedication(): void {
    if (!this.generatedDedication() || !navigator.clipboard) {
      return;
    }

    navigator.clipboard.writeText(this.generatedDedication()).then(() => {
      this.copyState.set('copied');
      setTimeout(() => {
        this.copyState.set('idle');
      }, 3000);
    }).catch(err => {
      console.error('Failed to copy dedication: ', err);
    });
  }
}
