import {MatInputModule} from '@angular/material/input';
import {NgModule} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {Routes, RouterModule} from '@angular/router';

import {SignupComponent} from './components/signup/signup.component';
import {SigninComponent} from './components/signin/signin.component';
import {SharedModule} from '../../shared/shared.module';
import {ProfileComponent} from './components/profile/profile.component';

const childRoutes: Routes = [
  {
    path: '',
    children: [
      {path: '', redirectTo: 'signin', pathMatch: 'full'},
      {path: 'signin', component: SigninComponent},
      {path: 'signup', component: SignupComponent},
      {path: 'profile', component: ProfileComponent},
    ],
  },
];

@NgModule({
  declarations: [SignupComponent, SigninComponent, ProfileComponent],
  imports: [
    SharedModule.forChild(),
    MatFormFieldModule,
    MatInputModule,
    RouterModule.forChild(childRoutes),
  ],
})
export class UserModule {}
