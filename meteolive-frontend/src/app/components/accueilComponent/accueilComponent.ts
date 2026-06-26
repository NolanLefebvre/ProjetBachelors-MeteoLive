import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { MeteoService } from '../../services/meteo.service';
import {  FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-accueil',
  imports: [FormsModule ],
  templateUrl: './accueilComponent.html',
  styleUrl: './accueilComponent.scss',
})
export class accueilComponent {
  constructor(private meteoService: MeteoService,private router: Router) {}
  
deconnexion(){
  console.log("deconnexion")
  localStorage.removeItem('token');
  this.router.navigate(['/connexion']);
}

  ngOnInit(): void {
        this.meteoService.getMeteo('Berlin').subscribe(data => {
        console.log(data);
    });
    }
}
