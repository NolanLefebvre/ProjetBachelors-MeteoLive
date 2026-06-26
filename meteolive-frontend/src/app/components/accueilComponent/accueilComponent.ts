import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { MeteoService } from '../../services/meteo.service';
import {  FormsModule } from '@angular/forms';


@Component({
  selector: 'app-accueil',
  imports: [FormsModule ],
  templateUrl: './accueilComponent.html',
  styleUrl: './accueilComponent.scss',
})
export class accueilComponent {
  constructor(private meteoService: MeteoService) {}
  
  ngOnInit(): void {
        this.meteoService.getMeteo('Berlin').subscribe(data => {
        console.log(data);
    });
    }
}
