import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ProfileComponent } from './components/profile/profile.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { FooterComponent } from './components/footer/footer.component';
import { RegisterComponent } from './components/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService, JWT_OPTIONS  } from '@auth0/angular-jwt';
import { LoginComponent } from './components/login/login.component';
import { AddExperienceWindowComponent } from './components/add-experience-window/add-experience-window.component';
import { EditExperienceComponent } from './components/edit-experience/edit-experience.component';
import { MainComponent } from './components/main/main.component';
import { ProfileDetailsComponent } from './components/profile-details/profile-details.component';
import { EditExperienceWindowComponent } from './components/edit-experience-window/edit-experience-window.component';
import { EditEducationComponent } from './components/edit-education/edit-education.component';
import { EditEducationWindowComponent } from './components/edit-education-window/edit-education-window.component';
import { EditLicenseWindowComponent } from './components/edit-license-window/edit-license-window.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProfileComponent,
    FooterComponent,
    RegisterComponent,
    LoginComponent,
    AddExperienceWindowComponent,
    EditExperienceComponent,
    MainComponent,
    ProfileDetailsComponent,
    EditExperienceWindowComponent,
    EditEducationComponent,
    EditEducationWindowComponent,
    EditLicensesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
