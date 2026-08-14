import { Component, ChangeDetectorRef } from '@angular/core';
import { ProfilService } from '../../services/profil.service';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profil',
  imports: [CommonModule, AsyncPipe, FormsModule],
  templateUrl: './profilComponent.html',
  styleUrl: './profilComponent.scss',
})
export class profilComponent {

  profil$: Observable<any>;
  favoris$: Observable<any>;
  notes$: Observable<any>;
  nomVille: string = '';
  unite: string = 'c';
  messageVilleDefaut: string = '';
  erreurVilleDefaut: string = '';
  chargement: boolean = true;

  constructor(private profilService: ProfilService, private router: Router, private cdr: ChangeDetectorRef) {
    this.profil$ = this.profilService.getProfil();
    this.favoris$ = this.profilService.getFavoris();
    this.notes$ = this.profilService.getNotes().pipe(
        map((notes: any[]) => notes.slice(0, 5))
    );

    this.profilService.getProfil().subscribe((profil: any) => {
    console.log('profil unite:', profil.unite);
    this.unite = profil.unite || 'c';
    this.chargement = false;
    this.cdr.detectChanges();
});
}

  favsVille(nomVille: string) {
    this.router.navigate(['/accueil'], { queryParams: { ville: nomVille } });
  }

  villedefault(){
    this.messageVilleDefaut = '';
    this.erreurVilleDefaut = '';
    this.cdr.detectChanges();
    this.profilService.villedefault(this.nomVille).subscribe({
        next: (data) => {
            this.messageVilleDefaut = 'Ville par défaut mise à jour avec succès !';
            this.profil$ = this.profilService.getProfil();
            this.cdr.detectChanges();
            setTimeout(() => {
                this.messageVilleDefaut = '';
                this.cdr.detectChanges();
            }, 3000);
        },
        error: () => {
            this.erreurVilleDefaut = 'Ville introuvable, veuillez vérifier le nom saisi.';
            this.cdr.detectChanges();
            setTimeout(() => {
                this.erreurVilleDefaut = '';
                this.cdr.detectChanges();
            }, 3000);
          }
      });
    }

  supprimerFavori(id: number){
    this.profilService.deleteFavori(id).subscribe(data => {
        this.favoris$ = this.profilService.getFavoris();
        this.cdr.detectChanges();
    });
  }

  changerUnite(unite: string) {
    this.unite = unite;
    this.profilService.updateUnite(unite).subscribe(data => {
        this.cdr.detectChanges();
    });
  }

}