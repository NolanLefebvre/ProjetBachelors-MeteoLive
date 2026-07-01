import { Component,ChangeDetectorRef  } from '@angular/core';
import { ClassementsService } from '../../services/classements.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-classement-component',
  imports: [CommonModule],
  templateUrl: './classement-component.html',
  styleUrl: './classement-component.scss',
})
export class ClassementComponent {

  classementMeteo: any = null;  
  classementNotes: any = null;

constructor( private classementsService: ClassementsService,private cdr: ChangeDetectorRef) {}
ngOnInit(): void {
    this.classementsService.getClassementsMeteo().subscribe(data => {
      this.classementMeteo = data;
      console.log(data)
    });
    this.classementsService.getClassementsRessenti().subscribe(data => {
      this.classementNotes = data;
      console.log(data)
      this.cdr.detectChanges();
    });
  }
}