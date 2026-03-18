
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormField, applyEach, form, hidden, max, min, required, schema, submit } from '@angular/forms/signals';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { hugeCopy01, hugeTick01 } from '@ng-icons/huge-icons';
import { firstValueFrom } from 'rxjs';
import { AnimateOnScrollDirective } from '../../../directives/animate-on-scroll.directive';

interface Guest {
  name: string;
  isChild: boolean;
  age: number | null;
  note: string;
}

interface RsvpModel {
  guests: Guest[];
}

function createGuest(): Guest {
  return { name: '', isChild: false, age: null, note: '' };
}

const rsvpSchema = schema<RsvpModel>((p) => {
  applyEach(p.guests, (item) => {
    required(item.name);
    required(item.age);
    min(item.age, 0);
    max(item.age, 17);
    hidden(item.age, ({ valueOf }) => !valueOf(item.isChild));
  });
});

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, AnimateOnScrollDirective, NgIcon],
  providers: [provideIcons({ hugeTick01, hugeCopy01 })],
})
export class RsvpComponent {
  private http = inject(HttpClient);

  readonly model = signal<RsvpModel>({ guests: [createGuest()] });
  readonly f = form(this.model, rsvpSchema);

  submissionState = signal<'idle' | 'loading' | 'success' | 'error'>('idle');

  addGuest() {
    this.model.update((v) => ({ ...v, guests: [...v.guests, createGuest()] }));
  }

  removeGuest(index: number) {
    if (this.model().guests.length > 1) {
      this.model.update((v) => ({
        ...v,
        guests: v.guests.filter((_, i) => i !== index),
      }));
    }
  }

  async onRsvpSubmit(event: SubmitEvent) {
    event.preventDefault();
    await submit(this.f, async () => {
      this.submissionState.set('loading');
      try {
        await firstValueFrom(
          this.http.post('/api/rsvp', {
            guests: this.model().guests.map((g) => ({
              name: g.name,
              isChild: g.isChild,
              age: g.age,
              note: g.note,
            })),
          }),
        );
        this.submissionState.set('success');
        this.model.set({ guests: [createGuest()] });
      } catch (error) {
        console.error('RSVP submission failed', error);
        this.submissionState.set('error');
        setTimeout(() => this.submissionState.set('idle'), 4000);
      }
      return null;
    });
  }

  // --- Gift List Logic ---
  iban = 'IT98B0103071611000063474333';
  copyState = signal<'idle' | 'copied'>('idle');

  copyIban(): void {
    if (!this.iban || !navigator.clipboard) {
      return;
    }

    navigator.clipboard
      .writeText(this.iban)
      .then(() => {
        this.copyState.set('copied');
        setTimeout(() => {
          this.copyState.set('idle');
        }, 3000);
      })
      .catch((err) => {
        console.error('Failed to copy IBAN: ', err);
      });
  }
}
