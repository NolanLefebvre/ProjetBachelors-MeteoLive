import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MeteoService  {
private apiUrl = 'http://localhost:8000/api';


  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
}

  getMeteo(nomVille: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/meteo/${nomVille}`, {
      headers: this.getHeaders()
    });
  }
  getMeteoprevision(nomVille: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/meteo/${nomVille}/previsions`, {
      headers: this.getHeaders()
    });
  }

}
