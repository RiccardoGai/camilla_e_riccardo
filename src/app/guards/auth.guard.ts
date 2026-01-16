import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route: ActivatedRouteSnapshot): Promise<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const hasPasswordParam = route.queryParamMap.has('password');

  const createCleanUrlTree = (): UrlTree => {
    const currentPath = route.pathFromRoot
      .map((r) => r.url.map((segment) => segment.path).join('/'))
      .filter((path) => path)
      .join('/');
    const queryParams = { ...route.queryParams };
    delete queryParams['password'];
    return router.createUrlTree([`/${currentPath}`], { queryParams });
  };

  if (authService.isAuthenticated()) {
    if (hasPasswordParam) {
      return createCleanUrlTree();
    }
    return true;
  }

  const sessionValid = await authService.checkSession();
  if (sessionValid) {
    if (hasPasswordParam) {
      return createCleanUrlTree();
    }
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
