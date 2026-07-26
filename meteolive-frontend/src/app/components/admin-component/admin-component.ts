import { Component,ChangeDetectorRef  } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-component',
  imports: [CommonModule],
  templateUrl: './admin-component.html',
  styleUrl: './admin-component.scss',
})
export class AdminComponent {

  Users:any=null;
  Notes:any=null;

  constructor( private adminService: AdminService,private cdr: ChangeDetectorRef) {}
  supprimerUser(id: number) {
    this.adminService.deleteUser(id).subscribe(data => {
        this.Users = this.Users.filter((u: any) => u.id !== id);
        this.cdr.detectChanges();
    });
  }
  supprimerNote(id: number) {
    this.adminService.deleteNote(id).subscribe(data => {
        this.Notes = this.Notes.filter((u: any) => u.id !== id);
        this.cdr.detectChanges();
    });
  }
  ngOnInit(): void {
    this.adminService.getUserAdmin().subscribe(data => {
      this.Users = data;
      this.cdr.detectChanges();
    });
    this.adminService.getNotes().subscribe(data => {
      this.Notes = data;
      this.cdr.detectChanges();
    });
  }
}
