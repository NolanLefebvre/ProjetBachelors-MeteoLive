import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgForm, FormsModule } from '@angular/forms';
@Component({
  selector: 'app-connexion-component',
  imports: [FormsModule],
  templateUrl: './connexion-component.html',
  styleUrl: './connexion-component.scss',
})
export class ConnexionComponent {

  constructor( private authService: AuthService) {}


onSubmit(form: NgForm) {
    if (form.valid) {
        this.authService.login(form.value.email, form.value.password).subscribe(data => {
            console.log(data.token);
        });
    }
}

}
