import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inscription-component',
  imports: [FormsModule, CommonModule],
  templateUrl: './inscription-component.html',
  styleUrl: './inscription-component.scss',
})
export class InscriptionComponent {

  loading: boolean = false;
  erreur: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  connexion() {
    this.router.navigate(['/connexion']);
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.loading = true;
      this.erreur = '';

      this.authService.register(
        form.value.pseudo,
        form.value.email,
        form.value.password
      ).subscribe({
        next: () => {
          this.authService.login(form.value.email, form.value.password).subscribe({
            next: () => {
              this.loading = false;
              this.router.navigate(['/accueil']);
            },
            error: () => {
              this.loading = false;
              this.router.navigate(['/connexion']);
            }
          });
        },
        error: (err) => {
          this.loading = false;
          if (err.status === 409) {
            this.erreur = 'Cet email est déjà utilisé.';
          } else {
            this.erreur = 'Une erreur est survenue, veuillez réessayer.';
          }
        }
      });
    }
  }
}