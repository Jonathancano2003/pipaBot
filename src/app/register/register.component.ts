import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RecaptchaModule } from 'ng-recaptcha';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RecaptchaModule ,RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isSubmitted = false;
  loading = false;
  captchaResponse: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
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
  
    if (this.registerForm.invalid || this.registerForm.value.password !== this.registerForm.value.confirmPassword || !this.captchaResponse) {
      alert('❌ Verifica los campos y completa el captcha');
      return;
    }
  
    this.loading = true;
    const { username, password } = this.registerForm.value;
  
    this.http.post<{ success: boolean; error?: string }>('https://pipabot.nite.black/api/register', {
      nombre: username,
      password: password,
      recaptcha: this.captchaResponse
    }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          alert('✅ Usuario registrado exitosamente');
          this.router.navigate(['/login']);
        } else {
          alert('❌ ' + (res.error ?? 'No se pudo registrar'));
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error en el registro:', err);
        alert('❌ Error al conectar con el servidor');
      }
    });
  }
  captchaResolved(response: string) {
    this.captchaResponse = response;
  }
}
