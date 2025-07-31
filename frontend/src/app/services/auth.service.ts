import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environments';
import { HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})


export class AuthService {
  private readonly API_URL = environment.apiUrl;
  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient, private snackBar: MatSnackBar, private router: Router) { }

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(`${this.API_URL}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
        })
      );
  }

  register(nombre: string, email: string, password: string) {
    const body = { nombre, email, password };

    console.log('Enviando registro:', body); // Depuración

    return this.http.post(
      `${this.API_URL}/auth/register`,
      body,
      this.httpOptions
    ).pipe(
      tap((response) => {
        console.log('Respuesta del servidor:', response); // Depuración
        this.snackBar.open('Registro exitoso', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/auth/login']);
      }),
      catchError(error => {
        console.error('Error en registro:', error); // Depuración
        const errorMsg = error.error?.message || error.message || 'Error en el registro';
        this.snackBar.open(errorMsg, 'Cerrar', { duration: 5000 });
        return throwError(() => error);
      })
    );
  }


  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

