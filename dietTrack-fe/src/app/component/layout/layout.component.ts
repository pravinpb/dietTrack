import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  constructor(private router:Router) { }
  onLogout(){
    if (confirm('Confirm that you wanted to logout?')){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }}

  onMembers(){
    this.router.navigate(['/members']);
  }

  onHome(){
    this.router.navigate(['/members']);
  }
}
