import { Component, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgForm, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-connexion-component',
  imports: [FormsModule, CommonModule],
  templateUrl: './connexion-component.html',
  styleUrl: './connexion-component.scss',
})
export class ConnexionComponent {

  loading: boolean = false;
  erreur: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  inscription() {
    this.router.navigate(['/inscription']);
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.loading = true;
      this.erreur = '';

      this.authService.login(form.value.email, form.value.password).subscribe({
        next: (data) => {
          console.log('Connexion réussie');
          this.loading = false;
          this.cdr.detectChanges();
          this.router.navigate(['/accueil']);
        },

        error: (err) => {
          this.loading = false;
          if (err.status === 429) {
              this.erreur = 'Trop de tentatives, veuillez réessayer dans 1 minute.';
          } else {
              this.erreur = 'Email ou mot de passe incorrect.';
          }
          this.cdr.detectChanges();
      },

        complete: () => {
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }
}