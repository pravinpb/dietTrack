import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'] // Note: Use 'styleUrls' instead of 'styleUrl' for multiple stylesheets
})
export class MembersComponent {
  members: any[] = [{member_name: "John Doe",
  date_of_birth: "1990-01-01",
  gender: "Male",
  height: 180,
  weight: 75,
  puberty: true,
  age_of_puberty: 14,
  menopause: false,
  country: "USA"}]; // Array to store the fetched members

  constructor(private http: HttpClient, private router: Router) { 
    if (!localStorage.getItem('token')) {
      console.log(localStorage.getItem('token'));
      this.router.navigate(['/login']);
    } 
    this.getMembers();
  }

  getMembers() {
    this.http.get('http://localhost:5000/members').subscribe({
      next: (response: any) => {
        console.log(response);
        this.members = response; // Store the response data in the 'members' property
      },
      error: (error) => {
        console.error('Error fetching members:', error);
      }
    });
  }
}


