import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitted = false;
  loading = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    const { username, password } = this.loginForm.value;

    this.http.post<{ success: boolean; error?: string }>('https://pipabot.nite.black/api/login', {
      nombre: username,
      password: password
    }).subscribe({
      next: (res) => {
        this.loading = false;

        if (res.success) {
          localStorage.setItem('usuarioLogueado', 'true');
          this.router.navigate(['/chat']);
        } else {
          alert('❌ ' + (res.error ?? 'Usuario o contraseña incorrectos'));
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error del backend:', err);
        alert('❌ Error al conectar con el servidor');
      }
    });
  }
  goToRegister() {
    this.router.navigate(['/register']);
  }
  
}
