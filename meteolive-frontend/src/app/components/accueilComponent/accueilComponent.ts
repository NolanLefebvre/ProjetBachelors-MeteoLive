import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { MeteoService } from '../../services/meteo.service';
import {  FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-accueil',
  imports: [FormsModule,RouterModule ],
  templateUrl: './accueilComponent.html',
  styleUrl: './accueilComponent.scss',
})
export class accueilComponent {
  constructor(private meteoService: MeteoService,private router: Router) {}
  nomVille: string = '';

  deconnexion(){
    console.log("deconnexion")
    localStorage.removeItem('token');
    this.router.navigate(['/connexion']);
  }
  meteo(){
  this.meteoService.getMeteo(this.nomVille).subscribe(data => {
          console.log(data);
      });
  this.meteoService.getMeteoprevision(this.nomVille).subscribe(data=>{
    console.log(data);
  });
  }
  ngOnInit(): void {
        
    }


}
