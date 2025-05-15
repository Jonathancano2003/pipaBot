import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RecaptchaModule } from 'ng-recaptcha';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RecaptchaModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitted = false;
  loading = false;
  captchaResponse: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onCaptchaResolved(response: string | null): void {
    if (response) {
      this.captchaResponse = response;
    } else {
      console.warn('Captcha no resuelto correctamente');
    }
  }
  

  onSubmit(): void {
    this.isSubmitted = true;
  
    if (this.loginForm.invalid || !this.captchaResponse) {
      alert('❌ Completa el captcha para continuar');
      return;
    }
  
    this.loading = true;
    const { username, password } = this.loginForm.value;
  
    this.http.post<{ success: boolean; error?: string }>('https://pipabot.nite.black/api/login', {
      nombre: username,
      password: password,
      recaptcha: this.captchaResponse
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
  captchaResolved(response: string) {
    this.captchaResponse = response;
  }  
}
