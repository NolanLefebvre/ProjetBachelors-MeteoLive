import { Component } from '@angular/core';
import { FormsModule,NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-inscription-component',
  imports: [FormsModule],
  templateUrl: './inscription-component.html',
  styleUrl: './inscription-component.scss',
})
export class InscriptionComponent {

    constructor( private authService: AuthService,private router: Router) {}
  connexion(){
    this.router.navigate(['/connexion']);
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
        this.authService.register(
            form.value.pseudo,
            form.value.email,
            form.value.password
        ).subscribe(data => {
            console.log(data);
            
        
    this.authService.login(form.value.email, form.value.password).subscribe(data => {
            console.log(data.token);
        });
  setTimeout(() => {
            this.router.navigate(['/accueil']);}, 2500)
        });
    }
}
}
