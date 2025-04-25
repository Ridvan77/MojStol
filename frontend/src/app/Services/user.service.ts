import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { TokenService } from './token.service';

export interface UserDto {
  userId: number;
  name: string;
  surname: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  phoneNumber: string;
  dateOfBirth: string;
  roleId: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5137/api';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  getAllUsers(nameSurname?: string | null, roleId?: number): Observable<UserDto[]> {
    let params = new HttpParams();

    if (nameSurname) {
      params = params.set('nameSurname', nameSurname);
    }

    if (roleId !== undefined) {
      params = params.set('roleId', roleId.toString());
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.tokenService.getToken()}`);

    return this.http.get<UserDto[]>(`${this.apiUrl}/GetAllUsers`, { headers, params });
  }

  getActiveUsersAndOwnersCount(): Observable<{ usersCount: number, ownersCount: number }> {
    return this.getAllUsers().pipe(
      map((users) => {
        const usersCount = users.filter((user) => user.isActive && user.roleId === 2).length; // Users
        const ownersCount = users.filter((user) => user.isActive && user.roleId === 3).length; // Owners
        return { usersCount, ownersCount };
      })
    );
  }
  

  getUserById(id: number): Observable<UserDto> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.tokenService.getToken()}`);
    return this.http.get<UserDto>(`${this.apiUrl}/GetUserById/${id}`, { headers });
  }


  updateUser(id: number, updateUserDto: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.tokenService.getToken()}`);
    return this.http.put(`${this.apiUrl}/UpdateUser/${id}`, updateUserDto, { headers });
  }

  deleteUser(id: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.tokenService.getToken()}`);
    return this.http.delete(`${this.apiUrl}/DeleteUser/${id}`, { headers });
  }
}
