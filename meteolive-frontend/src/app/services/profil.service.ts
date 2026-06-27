import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfilService {

   private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getProfil(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`, {
        headers: new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        })
    });
}
getFavoris(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me/favoris`, {
        headers: new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        })
    });
}

getNotes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me/notes`, {
        headers: new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        })
    });
}
}
