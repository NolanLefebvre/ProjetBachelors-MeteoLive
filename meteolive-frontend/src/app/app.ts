import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/layout/navbar-component/navbar-component';
import { FooterComponent } from './components/layout/footer-component/footer-component';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent,RouterOutlet,FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('meteolive-frontend');
}
