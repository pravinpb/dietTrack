import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {

  loginObj: any = {
    "family_name": '',
    "password": ''
   };

  signupObj: any = {
    "name": '',
    "email": '',
    "password": ''
   };
   
   constructor(private http: HttpClient, private router:Router) { }

   onLogin() {
    console.log("clickLogin", this.loginObj);
    const headers = new HttpHeaders({
       'Content-Type': 'application/json'
    });
    this.http.post('http://localhost:5000/login', this.loginObj, { headers: headers }).subscribe((res:any) => {
         console.log(res[1]);
         alert('Login Success');
         localStorage.setItem('token', res[1]);
         this.router.navigate(['/members']);
       }
    );
   }

   onSignup() {
    console.log("clickSignup", this.signupObj);
    this.http.post('http://localhost:5000/user', this.signupObj).subscribe((res:any) => {
          console.log(res);
          alert('Signup Success');
          this.router.navigate(['/login']);
        });
   }
}