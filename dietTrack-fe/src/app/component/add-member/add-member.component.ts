import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrl: './add-member.component.scss'
})
export class AddMemberComponent {
  constructor(private http: HttpClient, private router: Router) { 
    if (!localStorage.getItem('token')) {
      console.log(localStorage.getItem('token'));
      this.router.navigate(['/login']);
    } 
  }

  memberObj: any = {
    "member_name": '',
    "date_of_birth": '',
    "gender": '',
    "height": '',
    "weight": '',
    "puberty": 'False',
    "age_of_puberty": '',
    "menupause": 'False',
    "country": ''
  }

  onAddMember() {
    console.log("clickAddMember", this.memberObj);
    this.http.post('http://localhost:5000/members', this.memberObj).subscribe((res: any) => {
      console.log(res);
      alert('Member Added');
      this.router.navigate(['/members']);
    });
  }
}
