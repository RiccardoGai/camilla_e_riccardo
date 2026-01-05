import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route: ActivatedRouteSnapshot): Promise<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  const sessionValid = await authService.checkSession();
  if (sessionValid) {
    return true;
  }

  const password = route.queryParamMap.get('password');

  if (password) {
    const loginSuccess = await authService.login(password);
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
