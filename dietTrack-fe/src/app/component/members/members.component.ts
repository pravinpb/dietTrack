import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'] // Note: Use 'styleUrls' instead of 'styleUrl' for multiple stylesheets
})
export class MembersComponent {
  membersList: any[] = [];
  members: any[] = [{member_name: "John Doe",
  date_of_birth: "1990-01-01",
  gender: "Male",
  height: 180,
  weight: 75,
  puberty: true,
  age_of_puberty: 14,
  menopause: false,
  country: "USA"},
  
  {member_name: "John Doe",
  date_of_birth: "1990-01-01",
  gender: "Male",
  height: 180,
  weight: 75,
  puberty: true,
  age_of_puberty: 14,
  menopause: false,
  country: "USA"}]; 

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
        console.log("hwllo",response);
        const member = {
        member_name : response[0][2],
        date_of_birth : response[0][3],
        gender :  response[0][4],
        height : response[0][5],
        weight : response[0][6],
        puberty : response[0][7],
        age_of_puberty : response[0][8],
        menupause : response[0][9],
        country : response[0][10]
        }
        console.log("member",member);
        this.membersList.push(member);
      },
      error: (error) => {
        console.error('Error fetching members:', error);
      }
    });
  }
}


