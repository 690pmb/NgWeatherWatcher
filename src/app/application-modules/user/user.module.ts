import { MatInputModule } from '@angular/material/input';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Routes, RouterModule } from '@angular/router';

import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { SharedModule } from '../../shared/shared.module';

const childRoutes: Routes = [
    {
        path: '',
        children: [
            { path: '', redirectTo: 'signin', pathMatch: 'full' },
            { path: 'signin', component: SigninComponent },
            { path: 'signup', component: SignupComponent }
        ]
    }
];

@NgModule({
    declarations: [SignupComponent, SigninComponent],
    imports: [
        SharedModule.forChild(),
        MatFormFieldModule,
        MatInputModule,
        RouterModule.forChild(childRoutes)
    ]
})
export class UserModule {}
