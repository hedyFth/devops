import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const user = authService.getCurrentUser();
  const allowedRoles = route.data?.['roles'] as string[];

  if (!allowedRoles || !user) {
    return false;
  }

  if (allowedRoles.includes(user.role)) {
    return true;
  }

  router.navigate(['/access-denied']);
  return false;
};

