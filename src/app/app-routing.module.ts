import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { EditExperienceComponent } from './components/edit-experience/edit-experience.component';
import { MainComponent } from './components/main/main.component';
import { ProfileDetailsComponent } from './components/profile-details/profile-details.component';
import { EditEducationComponent } from './components/edit-education/edit-education.component';
import { EditLicensesComponent } from './components/edit-licenses/edit-licenses.component';
import { EditLanguagesComponent } from './components/edit-languages/edit-languages.component';
import { EditSkillsComponent } from './components/edit-skills/edit-skills.component';
import { MyNetworkComponent } from './components/my-network/my-network.component';
import { MessagingComponent } from './components/messaging/messaging.component';
import { HomeComponent } from './components/home/home.component';

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
          },
          {
            path: 'edit-licenses',
            component: EditLicensesComponent,
          },
          {
            path: 'edit-languages',
            component: EditLanguagesComponent,
          },
          {
            path: 'edit-skills',
            component: EditSkillsComponent,
          },
        ]
      },
      {
        path: 'my-network',
        component: MyNetworkComponent
      },
      {
        path: 'messaging',
        component: MessagingComponent,
      },
      {
        path: 'home',
        component: HomeComponent,
      }
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
