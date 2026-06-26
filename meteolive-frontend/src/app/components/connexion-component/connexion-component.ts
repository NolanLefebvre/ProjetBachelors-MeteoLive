import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgForm, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-connexion-component',
  imports: [FormsModule],
  templateUrl: './connexion-component.html',
  styleUrl: './connexion-component.scss',
})
export class ConnexionComponent {

  constructor( private authService: AuthService,private router: Router) {}

  inscription(){
    this.router.navigate(['/inscription']);
  }

onSubmit(form: NgForm) {
    if (form.valid) {
        this.authService.login(form.value.email, form.value.password).subscribe(data => {
          setTimeout(() => {
            this.router.navigate(['/accueil']);
          }, 2500)
        
            console.log(data.token);
        });
    }
    
}

}
