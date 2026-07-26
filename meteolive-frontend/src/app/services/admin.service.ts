import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'http://localhost:8000/api/admin';


  constructor(private http: HttpClient) {}

  getUserAdmin(): Observable<any> {
      return this.http.get(`${this.apiUrl}/utilisateurs`, {
          headers: new HttpHeaders({
              'Authorization': `Bearer ${localStorage.getItem('token')}`
          })
      });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/utilisateurs/${id}`, {
        headers: new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        })
    });
}

getNotes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/notes`, {
        headers: new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        })
    });
}

deleteNote(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/notes/${id}`, {
        headers: new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        })
    });
}
}
