import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';

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
