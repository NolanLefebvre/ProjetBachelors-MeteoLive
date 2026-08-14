import { Routes } from '@angular/router';
import { accueilComponent } from './components/accueilComponent/accueilComponent';
import { profilComponent } from './components/profilComponent/profilComponent';
import { ConnexionComponent } from './components/connexion-component/connexion-component';
import { authGuard } from './guards/auth-guard';
import { InscriptionComponent } from './components/inscription-component/inscription-component';
import { ClassementComponent } from './components/classement-component/classement-component';
import { AdminComponent } from './components/admin-component/admin-component';
import { adminGuard } from './guards/admin-guard';
import { NotFoundComponent } from './components/not-found-component/not-found-component';

export const routes: Routes = [
    { path: '', redirectTo: '/accueil', pathMatch: 'full' },
    { path: 'connexion', component: ConnexionComponent },
    { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
    { path: 'profile', component: profilComponent, canActivate: [authGuard] },
    { path: 'accueil', component: accueilComponent, canActivate: [authGuard] },
    { path: 'classements', component: ClassementComponent, canActivate: [authGuard] },
    { path: 'inscription', component: InscriptionComponent },
    { path: '**', component: NotFoundComponent },
];
