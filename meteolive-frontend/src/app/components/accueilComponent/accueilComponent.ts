import { Component } from '@angular/core';
import { MeteoService } from '../../services/meteo.service';
import {  FormsModule ,} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { ProfilService } from '../../services/profil.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-accueil',
  imports: [FormsModule,CommonModule ],
  templateUrl: './accueilComponent.html',
  styleUrl: './accueilComponent.scss',
})
export class accueilComponent {
  constructor(private http: HttpClient,private meteoService: MeteoService,private router: Router,private cdr: ChangeDetectorRef, private profilService:ProfilService, private sanitizer: DomSanitizer) {}
  nomVille: string = '';
  date: string = '';
  meteoActuelle: any = null;
  meteoPrevisions: any = null;
  favoris: any[] = [];
  estFavori: boolean = false;
  note: number = 0;
  dejaNote :boolean= false;
  villeAffichee: string = '';
  mapUrl: SafeResourceUrl = '';


meteo(){
    this.meteoPrevisions = null;
    this.meteoActuelle = null;
    this.cdr.detectChanges();
    this.villeAffichee = this.nomVille.charAt(0).toUpperCase() + this.nomVille.slice(1).toLowerCase();
    this.nomVille = this.villeAffichee;

    const url = `https://maps.google.com/maps?q=${this.villeAffichee}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.estFavori = false;
    this.dejaNote = false;
    const aujourdhui = new Date().toISOString().split('T')[0];
    if (!this.date || this.date === aujourdhui) {
    this.meteoService.getMeteo(this.nomVille).subscribe(data => {
        this.meteoActuelle = data;
        this.cdr.detectChanges();
    });
} else {
    this.meteoActuelle = null;
    this.cdr.detectChanges();
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

this.profilService.getNotes().subscribe(data => {
        const aujourdhui = new Date().toISOString().split('T')[0];
        this.dejaNote = data.some((n: any) => 
            n.ville === this.nomVille && n.date.split(' ')[0] === aujourdhui
        );
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

ajoutNote(){
    this.profilService.addNote(this.nomVille,this.note).subscribe(data => {
        this.dejaNote = true;
        console.log(data);
        this.cdr.detectChanges();
    });
}
localiser(): void {
    this.http.get('https://ipapi.co/json/').subscribe((data: any) => {
        this.nomVille = data.city;
        this.meteo();
    });
}
getMapUrl(): SafeResourceUrl {
    const url = `https://maps.google.com/maps?q=${this.villeAffichee}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
}
  ngOnInit(): void {
    setTimeout(() => {
        this.profilService.getProfil().subscribe(data => {
            if (data.villeDefaut) {
                this.nomVille = data.villeDefaut;
                this.meteo();
            } else {
                this.localiser();
            }
        });
    }, 0);
}   


}
