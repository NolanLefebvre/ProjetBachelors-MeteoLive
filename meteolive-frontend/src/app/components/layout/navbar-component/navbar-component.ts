import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-navbar-component',
  imports: [RouterModule,CommonModule],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.scss',
})
export class NavbarComponent {
  constructor(private router: Router) {}
  estAdmin(): boolean {
      const token = localStorage.getItem('token');
      if (!token) return false;
      try {
          const decoded: any = jwtDecode(token);
          return decoded.roles && decoded.roles.includes('ROLE_ADMIN');
      } catch (e) {
          return false;
      }
  }
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
