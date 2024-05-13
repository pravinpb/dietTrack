import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-member-profile',
  templateUrl: './member-profile.component.html',
  styleUrl: './member-profile.component.scss'
})
export class MemberProfileComponent {
  member_profile: any = {}; 
  constructor(private http: HttpClient, private router: Router, private shared: SharedService) { 
    if (!localStorage.getItem('token')) {
      console.log(localStorage.getItem('token'));
      this.router.navigate(['/login']);
    } 

    this.onProfileDetails();
  }

  onProfileDetails(){
    this.member_profile = this.shared.getMessage();
    const member_id = this.member_profile.member_id;
    console.log("member_id", member_id);
    this.http.get('http://localhost:5000/members/details/'+member_id).subscribe({
      next: (response: any) => {
        console.log("response",response);
        const member_profile = response;


    this.http.get('http://localhost:5000/members/cycles/'+member_id).subscribe({
      next: (response: any) => {
        console.log("response",response[0]);
        this.member_profile.cycles = response;
      },
      error: (error) => {
        console.error(error);
      }
    });

  }
});
}
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are 0-indexed in JavaScript
    const day = date.getDate();
    console.log("date",day,month,year);
    return `${day}-${month}-${year}`; // Format as DD-MM-YYYY
}
}
