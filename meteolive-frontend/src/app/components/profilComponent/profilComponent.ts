import { Component,ChangeDetectorRef } from '@angular/core';
import { ProfilService } from '../../services/profil.service';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profil',
  imports: [CommonModule, AsyncPipe],
  templateUrl: './profilComponent.html',
  styleUrl: './profilComponent.scss',
})
export class profilComponent {

  profil$: Observable<any>;
  favoris$: Observable<any>;
  notes$: Observable<any>;

  constructor(private profilService: ProfilService,private router: Router,private cdr: ChangeDetectorRef) {
    
    this.profil$ = this.profilService.getProfil();
    this.favoris$ = this.profilService.getFavoris();
    this.notes$ = this.profilService.getNotes();
  }
  supprimerFavori(id: number){
      this.profilService.deleteFavori(id).subscribe(data => {
          console.log(data);
          this.favoris$ = this.profilService.getFavoris();
          this.cdr.detectChanges();
      });
  }
}