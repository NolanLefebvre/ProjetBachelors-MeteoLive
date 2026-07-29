import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const adminGuard: CanActivateFn = () => {
    const router = inject(Router);
    const token = localStorage.getItem('token');

    if (!token) {
        router.navigate(['/connexion']);
        return false;
    }

    try {
        const decoded: any = jwtDecode(token);
        if (decoded.roles && decoded.roles.includes('ROLE_ADMIN')) {
            return true;
        }
    } catch (e) {
        router.navigate(['/connexion']);
        return false;
    }

    router.navigateByUrl('/accueil');
    return false;
};