import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { SignupComponent } from './component/signup/signup.component';
import { LayoutComponent } from './component/layout/layout.component';
import { MembersComponent } from './component/members/members.component';
import { AddMemberComponent } from './component/add-member/add-member.component';
import { EditMemberComponent } from './component/edit-member/edit-member.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path:'',
    component:LayoutComponent,
    children:[
      {
        path:'members',
        component:MembersComponent
      },
      {
        path:'add-member',
        component:AddMemberComponent
      },
      {
        path:'edit-members',
        component:EditMemberComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
