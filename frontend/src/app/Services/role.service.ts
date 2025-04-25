import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private baseUrl = 'http://localhost:5137/api/Role';


  constructor(private http: HttpClient) { }


  getAllRoles(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/GetPublicRoles`);
  }
}
