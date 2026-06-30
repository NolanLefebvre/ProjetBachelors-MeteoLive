import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-component',
  imports: [RouterModule,CommonModule],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.scss',
})
export class NavbarComponent {
  constructor(private router: Router) {}

  deconnexion(){
    localStorage.removeItem('token');
    this.router.navigate(['/connexion']);
}

  connecter(): boolean {
    if (localStorage.getItem('token')){
      return true;
    }
    return false
}

}
