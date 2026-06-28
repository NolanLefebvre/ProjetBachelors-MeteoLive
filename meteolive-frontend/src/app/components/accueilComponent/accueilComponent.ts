import { Component } from '@angular/core';
import { MeteoService } from '../../services/meteo.service';
import {  FormsModule ,} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { ProfilService } from '../../services/profil.service';

@Component({
  selector: 'app-accueil',
  imports: [FormsModule,CommonModule ],
  templateUrl: './accueilComponent.html',
  styleUrl: './accueilComponent.scss',
})
export class accueilComponent {
  constructor(private meteoService: MeteoService,private router: Router,private cdr: ChangeDetectorRef, private profilService:ProfilService) {}
  nomVille: string = '';
  date: string = '';
  meteoActuelle: any = null;
  meteoPrevisions: any = null;
  favoris: any[] = [];
  estFavori: boolean = false;

  deconnexion(){
    console.log("deconnexion")
    localStorage.removeItem('token');
    this.router.navigate(['/connexion']);
  }

  profile(){
    this.router.navigate(['/profile']);
  }
  meteo(){
    this.nomVille = this.nomVille.charAt(0).toUpperCase() + this.nomVille.slice(1).toLowerCase();
    const aujourdhui = new Date().toISOString().split('T')[0];
    if (!this.date || this.date === aujourdhui) {
        this.meteoService.getMeteo(this.nomVille).subscribe(data => {
            this.meteoActuelle = data;
            this.cdr.detectChanges();
        });
    }
    this.meteoService.getMeteoprevision(this.nomVille, this.date).subscribe(data => {
        this.meteoPrevisions = data;
        this.cdr.detectChanges();
    });
    this.profilService.getFavoris().subscribe(data => {
    console.log('favoris', data);
    console.log('nomVille', this.nomVille);
    this.favoris = data;
    this.estFavori = this.favoris.some(f => f.ville === this.nomVille);
    console.log('estFavori', this.estFavori);
    this.cdr.detectChanges();
});
}

ajouterFavori(){
    this.profilService.addFav(this.nomVille).subscribe(data => {
        console.log(data);
        this.estFavori = true;
        this.cdr.detectChanges();
    });
}
  ngOnInit(): void {
        
    }


}
