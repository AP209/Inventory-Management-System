import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid fade-in w-100 px-3">
      <div class="row justify-content-center align-items-center min-vh-100 w-100 m-0">
        <div class="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4 px-0">
          
          <div class="text-center mb-5">
            <div class="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle shadow-sm mb-3" style="width: 64px; height: 64px;">
              <i class="bi bi-box-seam-fill fs-2"></i>
            </div>
            <h2 class="fw-bold mb-1" style="color: var(--text-primary); letter-spacing: -0.5px;">Inventify</h2>
            <p class="text-muted">Sign in to manage your operations</p>
          </div>

          <div class="card border-0 shadow-lg" style="border-radius: 20px;">
            <div class="card-body p-4 p-sm-5">
              <div *ngIf="error" class="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger rounded-3 d-flex align-items-center mb-4" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                <div>{{ error }}</div>
              </div>

              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-4">
                  <label for="email" class="form-label text-muted fw-medium text-uppercase" style="font-size: 0.75rem;">Email Address</label>
                  <div class="input-group input-group-lg">
                    <span class="input-group-text bg-light border-end-0 text-muted px-3"><i class="bi bi-envelope"></i></span>
                    <input type="email" id="email" class="form-control bg-light border-start-0 ps-0 fs-6" formControlName="email" placeholder="admin@example.com">
                  </div>
                  <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" class="text-danger small mt-2 fw-medium">
                    <i class="bi bi-info-circle me-1"></i> Valid email is required.
                  </div>
                </div>

                <div class="mb-5">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <label for="password" class="form-label text-muted fw-medium text-uppercase mb-0" style="font-size: 0.75rem;">Password</label>
                  </div>
                  <div class="input-group input-group-lg">
                    <span class="input-group-text bg-light border-end-0 text-muted px-3"><i class="bi bi-lock"></i></span>
                    <input type="password" id="password" class="form-control bg-light border-start-0 ps-0 fs-6" formControlName="password" placeholder="••••••••">
                  </div>
                  <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="text-danger small mt-2 fw-medium">
                    <i class="bi bi-info-circle me-1"></i> Password is required.
                  </div>
                </div>

                <button type="submit" class="btn btn-primary btn-lg w-100 fw-medium shadow-sm py-3 rounded-3 d-flex justify-content-center align-items-center gap-2" [disabled]="loginForm.invalid || isLoading">
                  <span *ngIf="isLoading" class="spinner-border spinner-border-sm"></span>
                  <span *ngIf="!isLoading">Secure Sign In</span>
                  <i *ngIf="!isLoading" class="bi bi-arrow-right ms-1"></i>
                </button>
              </form>
            </div>
            
            <div class="card-footer bg-light border-0 py-3 text-center rounded-bottom-4">
              <p class="text-muted small mb-0">Authorized personnel only.</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';
  isLoading: boolean = false;
  
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['admin@example.com', [Validators.required, Validators.email]],
      password: ['admin', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.error = '';
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.error = 'Invalid credentials. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }
}
