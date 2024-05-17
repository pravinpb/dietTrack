declare var google: any;

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit{

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

   ngOnInit(){
    google.accounts.id.initialize({
      client_id: '720886867388-8qqnpstb2nrqsisrbd9h5bajpj7cam80.apps.googleusercontent.com',
      callback: (response: any) => {
        this.handleLogin(response);
      },
    });
  
    google.accounts.id.renderButton(document.getElementById("google-btn"), {
      theme: "outline",
      size: "large",
      text: "continue_with",
      width: "300px"
    });
  }
  

   onLogin() {
    console.log("clickLogin", this.loginObj);
    const headers = new HttpHeaders({
       'Content-Type': 'application/json'
    });
    this.http.post('http://localhost:5000/login', this.loginObj, { headers: headers }).subscribe((res:any) => {
         console.log(res[1]);
         alert('Login Success');
         localStorage.setItem('token', res[1])
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

   private decodeToken(token: string) {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
   }

   handleLogin(responce: any){
    if (responce) {
      const payload = this.decodeToken(responce.credential);
      sessionStorage.setItem('loggedInUser', JSON.stringify(payload));
      this.router.navigate(['/members']);
    }
   }
}