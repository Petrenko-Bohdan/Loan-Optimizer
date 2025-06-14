import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RegisterComponent } from '../register/register.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
		MatButtonModule,
		MatIconModule, 
		MatDialogModule,
		

  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
		private dialog: MatDialog
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email?.trim();
      const password = this.loginForm.value.password;

      this.authService.signIn(email, password).subscribe({
        next: () => {
          this.router.navigate(['/loan-form']);
          alert('Login successful');
        },
        error: (err) => {
          console.error('Login failed', err);
        },
      });
    }
  }

openRegisterDialog() {
  this.dialog.closeAll(); // закрыть логин
  this.dialog.open(RegisterComponent, {
    width: '100%',
    maxWidth: '420px',
    panelClass: 'custom-dialog-container',
  });
}

}
