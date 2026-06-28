import { Component } from '@angular/core';
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

  constructor(private profilService: ProfilService,private router: Router) {
    
    this.profil$ = this.profilService.getProfil();
    this.favoris$ = this.profilService.getFavoris();
    this.notes$ = this.profilService.getNotes();
  }

  accueil(){
    this.router.navigate(['/accueil']);
  }
}