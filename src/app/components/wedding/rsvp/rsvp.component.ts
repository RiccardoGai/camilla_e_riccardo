import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { hugeCopy01, hugeTick01 } from '@ng-icons/huge-icons';
import { firstValueFrom } from 'rxjs';
import { AnimateOnScrollDirective } from '../../../directives/animate-on-scroll.directive';

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styles: [
    `
      :host {
        display: block;
      }
      .section-to-animate {
        opacity: 0;
        transform: translateY(20px);
        transition:
          opacity 0.8s ease-out,
          transform 0.8s ease-out;
      }

      .section-to-animate.is-visible {
        opacity: 1;
        transform: translateY(0);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, AnimateOnScrollDirective, NgIcon],
  providers: [provideIcons({ hugeTick01, hugeCopy01 })],
})
export class RsvpComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  rsvpForm = this.fb.group({
    guests: this.fb.array([this.createGuestGroup()], Validators.required),
  });

  submissionState = signal<'idle' | 'loading' | 'success' | 'error'>('idle');

  get guests(): FormArray {
    return this.rsvpForm.get('guests') as FormArray;
  }

  createGuestGroup() {
    return this.fb.group({
      name: ['', Validators.required],
      isChild: [false],
      age: [''],
      note: [''],
    });
  }

  addGuest() {
    this.guests.push(this.createGuestGroup());
  }

  removeGuest(index: number) {
    if (this.guests.length > 1) {
      this.guests.removeAt(index);
    }
  }

  toggleChildAge(index: number) {
    const group = this.guests.at(index) as FormGroup;
    const isChildControl = group.get('isChild');
    const ageControl = group.get('age');

    if (isChildControl?.value) {
      ageControl?.setValidators([Validators.required]);
    } else {
      ageControl?.clearValidators();
      ageControl?.setValue('');
    }
    ageControl?.updateValueAndValidity();
  }

  async onRsvpSubmit() {
    if (this.rsvpForm.invalid) {
      this.rsvpForm.markAllAsTouched();
      return;
    }

    this.submissionState.set('loading');

    const payload = {
      guests: this.guests.getRawValue().map((guest) => ({
        name: guest.name ?? '',
        isChild: guest.isChild ?? false,
        age: guest.age ?? '',
        note: guest.note ?? '',
      })),
    };

    try {
      await firstValueFrom(this.http.post('/api/rsvp', payload));
      this.submissionState.set('success');
      this.rsvpForm.reset();
      this.guests.clear();
      this.addGuest(); // Add one back for the next submission
    } catch (error) {
      console.error('RSVP submission failed', error);
      this.submissionState.set('error');
      setTimeout(() => this.submissionState.set('idle'), 4000);
    }
  }

  // --- Gift List Logic ---
  iban = 'IT 60 X 12345 67890 123456789012';
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
