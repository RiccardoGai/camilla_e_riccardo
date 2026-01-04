import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormArray, Validators, FormGroup } from '@angular/forms';
import { AnimateOnScrollDirective } from '../../../directives/animate-on-scroll.directive';

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
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
  imports: [CommonModule, ReactiveFormsModule, AnimateOnScrollDirective],
})
export class RsvpComponent {
  // FIX: Explicitly type injected FormBuilder to resolve 'unknown' type error.
  private fb: FormBuilder = inject(FormBuilder);
  
  rsvpForm = this.fb.group({
    guests: this.fb.array([this.createGuestGroup()], Validators.required),
    notes: ['']
  });

  submissionState = signal<'idle' | 'loading' | 'success' | 'error'>('idle');

  get guests(): FormArray {
    return this.rsvpForm.get('guests') as FormArray;
  }

  createGuestGroup() {
    return this.fb.group({
      name: ['', Validators.required],
      isChild: [false],
      age: ['']
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
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For this demo, we'll assume success
    console.log('RSVP Submitted:', this.rsvpForm.value);
    this.submissionState.set('success');
    this.rsvpForm.reset();
    this.guests.clear();
    this.addGuest(); // Add one back for the next submission

    // Reset state after a few seconds
    //setTimeout(() => this.submissionState.set('idle'), 5000);
  }

  // --- Gift List Logic ---
  iban = 'IT 60 X 12345 67890 123456789012';
  copyState = signal<'idle' | 'copied'>('idle');

  copyIban(): void {
    if (!this.iban || !navigator.clipboard) {
      return;
    }

    navigator.clipboard.writeText(this.iban).then(() => {
      this.copyState.set('copied');
      setTimeout(() => {
        this.copyState.set('idle');
      }, 3000);
    }).catch(err => {
      console.error('Failed to copy IBAN: ', err);
    });
  }
}