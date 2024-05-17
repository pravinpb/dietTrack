import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-member-profile',
  templateUrl: './member-profile.component.html',
  styleUrls: ['./member-profile.component.scss'] // Corrected from styleUrl to styleUrls
})
export class MemberProfileComponent {
  @ViewChild('inputContainer', { static: false }) inputContainer!: ElementRef;
  inputsAdded = false;
  cycle_list: { cycle_id: number; start_date: string; end_date: string }[] = [];
  member_profile: any = {};

  start_date: HTMLInputElement | null = null;
  end_date: HTMLInputElement | null = null;

  constructor(private http: HttpClient, private router: Router, private shared: SharedService) {
    if (!localStorage.getItem('token')) {
      console.log(localStorage.getItem('token'));
      this.router.navigate(['/login']);
    }

    this.onProfileDetails();
  }

  onProfileDetails() {
    this.member_profile = this.shared.getMessage();
    const member_id = this.member_profile.member_id;
    console.log("member_id", member_id);
    this.http.get(`http://localhost:5000/members/details/${member_id}`).subscribe({
      next: (response: any) => {
        this.http.get(`http://localhost:5000/members/cycles/${member_id}`).subscribe({
          next: (response: any) => {
            for (let i = 0; i < response.length; i++) {
              const cycle = {
                cycle_id: response[i][0],
                start_date: response[i][2],
                end_date: response[i][3]
              };
              this.cycle_list.push(cycle);
            }
            this.cycle_list.sort((a, b) => {
              const dateA = new Date(a.start_date);
              const dateB = new Date(b.start_date);
              return dateA.getTime() - dateB.getTime();
            });
            console.log("sorted_cycle_list", this.cycle_list);
          },
          error: (error) => {
            console.error(error);
          }
        });
      }
    });
  }

  onAddCycle() {
    if (!this.inputsAdded) {
      const input1 = document.createElement('input');
      input1.type = 'date';
      this.start_date = input1;
      input1.placeholder = 'Cycle Start Date';
      this.inputContainer.nativeElement.appendChild(input1);

      const input2 = document.createElement('input');
      input2.type = 'date';
      this.end_date = input2;
      input2.placeholder = 'Cycle End Date';
      this.inputContainer.nativeElement.appendChild(input2);

      this.inputsAdded = true;
    }
  }

  onSubmit() {
    if (this.start_date?.value && this.end_date?.value) {
      const formattedStartDate = this.formatDate(this.start_date.value);
      const formattedEndDate = this.formatDate(this.end_date.value);
      this.http.post(`http://localhost:5000/members/cycles/${this.member_profile.member_id}`, {
        start_date: formattedStartDate,
        end_date: formattedEndDate
      }).subscribe({
        next: (response: any) => {
          console.log('Cycle added:', response);
        },
        error: (error) => {
          console.error('Error adding cycle:', error);
        }
      });
    } else {
      console.log('Dates not selected');
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are 0-indexed in JavaScript
    const day = date.getDate();
    return `${month}-${day}-${year}`; // Format as DD-MM-YYYY
  }
}
