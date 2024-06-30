import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginServiceService } from '../../services/auth/login-service.service';
import { userLogRequest } from '../../models/userLogRequest';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginError:string = "";
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  })

  ///constructor
  constructor(private router:Router, private _logService:LoginServiceService){
    localStorage.removeItem('user');
  }

  ///Este método se va a llamar cuando el usuario pulse el botón entrar
  ///This method will be called when user push enter button
  login(){
    this.loginError = "";
    if(this.loginForm.valid){
      this._logService.loginUser(this.loginForm.value as userLogRequest).subscribe({
        next:(userData) => {
          if(userData)
          {
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('first', "true");
            this.loginForm.reset();
            this.router.navigateByUrl('/inicio');
          }
          else
          {
            this.loginError = "Email o contraseña errónea.";
          }
        },
        error: (errorData => {
          this.loginError = errorData;
        })
      });
      
    }
    else{
      this.loginForm.markAllAsTouched();
      this.loginError = "Error. Introduzca todos los datos.";
    }
  }

  get email(){
    return this.loginForm.controls.email;
  }

  get pass(){
    return this.loginForm.controls.password;
  }
}