import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ClassementsService {
private apiUrl = 'http://localhost:8000/api';


  constructor(private http: HttpClient) {}

  getClassementsMeteo(): Observable<any> {
      return this.http.get(`${this.apiUrl}/classements/meteo`, {
          headers: new HttpHeaders({
              'Authorization': `Bearer ${localStorage.getItem('token')}`
          })
      });
  }

  getClassementsRessenti(): Observable<any> {
      return this.http.get(`${this.apiUrl}/classements/ressenti`, {
          headers: new HttpHeaders({
              'Authorization': `Bearer ${localStorage.getItem('token')}`
          })
      });
  }
  
}
