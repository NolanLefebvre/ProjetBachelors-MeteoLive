import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
    const router = inject(Router);
    const token = localStorage.getItem('token');

    if (token) {
        return true;
    }

    router.navigate(['/connexion'],{ queryParams: { message: 'Vous devez être connecté pour accéder à cette page' } });
    return false;
};