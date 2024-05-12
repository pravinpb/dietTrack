import { SharedService } from './../../service/shared.service';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'] // Note: Use 'styleUrls' instead of 'styleUrl' for multiple stylesheets
})
export class MembersComponent {
  membersList: any[] = []
  editMember: any[] = []

  constructor(private http: HttpClient, private router: Router,private shared: SharedService) { 
    if (!localStorage.getItem('token')) {
      console.log(localStorage.getItem('token'));
      this.router.navigate(['/login']);
    } 
    this.getMembers();
  }
  onAddMember() {
    this.router.navigate(['/add-member']);

  }

  getMembers() {
    this.http.get('http://localhost:5000/members').subscribe({
      next: (response: any) => {
        console.log("hwllo",response);
        for (let i = 0; i < response.length; i++) {
          const member = {
            member_id : response[i][1],
            member_name : response[i][2],
            date_of_birth : response[i][3],
            gender :  response[i][4],
            height : response[i][5],
            weight : response[i][6],
            puberty : response[i][7],
            age_of_puberty : response[i][8],
            menupause : response[i][9],
            country : response[i][10]
          }
            console.log("member",member);
            this.membersList.push(member);
      }
    },
      error: (error) => {
        console.error('Error fetching members:', error);
      }
    });
  }

  onEditMember(i: any) {
    console.log("editMember", this.membersList[i]);
    this.editMember = this.membersList[i];
    this.shared.setMessage(this.editMember);
    this.router.navigate(['/edit-members']);
  }

  onDeleteMember(i: any) {
    console.log("deleteMember", this.membersList[i].member_id);
      if (confirm('Are you sure you want to delete this task?')){
      this.http.delete('http://localhost:5000/members/' + this.membersList[i].member_id).subscribe((res: any) => {
        console.log(res);
        this.membersList = [];
        this.getMembers();
      });
  }
  }

}


