import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot): boolean | UrlTree => {
  const authService = inject(AuthService);
  // FIX: Explicitly type injected Router to resolve 'unknown' type errors.
  const router: Router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }
  
  const password = route.queryParamMap.get('password');
  
  if (password) {
    const loginSuccess = authService.login(password);
    if (loginSuccess) {
      // Password correct, redirect to root without query params.
      return router.createUrlTree(['/']);
    } else {
      // Password incorrect, redirect to login with an error flag.
      return router.createUrlTree(['/login'], { queryParams: { error: 'true' } });
    }
  }

  // Not authenticated and no password, redirect to login page.
  return router.createUrlTree(['/login']);
};