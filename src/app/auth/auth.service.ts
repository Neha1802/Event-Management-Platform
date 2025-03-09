import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

interface User {
  id: number;
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(username: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(`http://localhost:3000/users?username=${username}`)
      .pipe(
        map(users => {
          if (users.length > 0) {
            const user = users.find(u => u.password === password); 
            if (user) {
              localStorage.setItem('currentUser', JSON.stringify(user));
              this.currentUserSubject.next(user);
              return user;
            }
          }
          return null;
        })
      );
  }
  
  

  register(username: string, password: string, email: string): Observable<User> {
    const user = { username, password, email };
  
    return this.http.post<User>('http://localhost:3000/users', user).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      })
    );
  }
  
  

  logout(): void {
    this.http.post('/api/logout', {}).subscribe(() => {
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
    });
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }
}