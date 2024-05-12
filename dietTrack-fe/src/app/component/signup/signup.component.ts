import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  signupObj: any = {
    "family_name": '',
    "email": '',
    "password": ''
   };
    
   constructor(private http: HttpClient, private router:Router) { }

   onSignup() {
    console.log("clickSignup", this.signupObj);
    console.log('http://localhost:5000/user', this.signupObj);
    this.http.post('http://localhost:5000/user', this.signupObj).subscribe((res:any) => {
          console.log(res);
          alert('Signup Success');
          this.router.navigate(['/login']);
        });
   }

}
