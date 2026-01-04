import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class LoginComponent implements OnInit {
  // FIX: Explicitly type injected Router and ActivatedRoute to resolve 'unknown' type errors.
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  authService: AuthService = inject(AuthService);
  hasError = signal(false);
  showPassword = signal(false);

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      if (params.get('error')) {
        this.hasError.set(true);
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.hasError.set(false);
    
    const form = event.target as HTMLFormElement;
    const passwordInput = form.elements.namedItem('password') as HTMLInputElement;
    const password = passwordInput.value;
    
    if (password) {
      if (this.authService.login(password)) {
        this.router.navigate(['/']);
      } else {
        this.hasError.set(true);
      }
    }
  }
}