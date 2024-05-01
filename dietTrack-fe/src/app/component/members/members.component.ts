import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrl: './members.component.scss'
})


export class MembersComponent {
  constructor(private http: HttpClient, private router: Router) { 
    if (localStorage.getItem('token') == null) {
      this.router.navigate(['/login']);
    } 
    this.getMembers();
  }

  getMembers(){
    this.http.get('http://localhost:5000/members').subscribe({
      next: (response:any) => {
        console.log(response)
      }
    })
  }
}
