declare var google: any;

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit{

  signupObj: any = {
    "family_name": '',
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

  onSignup() {
  console.log("clickSignup", this.signupObj);
  console.log('http://localhost:5000/user', this.signupObj);
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
      const email = payload.email;
      const name = payload.name;
      this.signupObj.family_name = name;
      this.signupObj.email = email;
    }
   }

}

