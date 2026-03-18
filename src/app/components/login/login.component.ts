
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LogoComponent],
})
export class LoginComponent implements OnInit {
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  authService: AuthService = inject(AuthService);
  hasError = signal(false);
  showPassword = signal(false);

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      if (params.get('error')) {
        this.hasError.set(true);
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword.update((v) => !v);
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    this.hasError.set(false);

    const form = event.target as HTMLFormElement;
    const passwordInput = form.elements.namedItem('password') as HTMLInputElement;
    const password = passwordInput.value;

    if (password) {
      const success = await this.authService.login(password);
      if (success) {
        this.router.navigate(['/']);
      } else {
        this.hasError.set(true);
      }
    }
  }
}
