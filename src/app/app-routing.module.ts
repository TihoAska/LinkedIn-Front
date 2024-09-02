import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { EditExperienceComponent } from './components/edit-experience/edit-experience.component';
import { MainComponent } from './components/main/main.component';
import { ProfileDetailsComponent } from './components/profile-details/profile-details.component';
import { EditEducationComponent } from './components/edit-education/edit-education.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,

    children: [
      {
        path: 'your-profile',
        component: ProfileComponent,

        children: [
          {
            path: 'profile-details',
            component: ProfileDetailsComponent,
          },
          {
            path: 'edit-experience',
            component: EditExperienceComponent,
          },
          {
            path: 'edit-education',
            component: EditEducationComponent,
          }
        ]
      },
    ]
  },
  {
    path: 'sign-up',
    component: RegisterComponent,
  },
  {
    path: 'sign-in',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
