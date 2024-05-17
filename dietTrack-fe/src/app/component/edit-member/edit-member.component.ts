import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../service/shared.service';

@Component({
  selector: 'app-edit-member',
  templateUrl: './edit-member.component.html',
  styleUrl: './edit-member.component.scss'
})
export class EditMemberComponent {

  edit_data: any[] = [];
  constructor(private http: HttpClient, private router: Router, private shared: SharedService) { 
    if (!localStorage.getItem('token')) {
      console.log(localStorage.getItem('token'));
      this.router.navigate(['/login']);
    } 

    this.edit_data = this.shared.getMessage();
    console.log("edit_data 4", this.edit_data);
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

  onEditMember() {
    console.log("clickAddMember", this.memberObj);
    this.http.put('http://localhost:5000/members', this.memberObj).subscribe((res: any) => {
      console.log(res);
      alert('Member Added');
      this.router.navigate(['/members']);
    });
  }
}
