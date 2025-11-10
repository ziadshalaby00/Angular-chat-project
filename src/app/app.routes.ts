import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { ResetPassword } from './reset-password/reset-password';
import { Page404Comp } from './page404/page404';
import { Profile } from './profile/profile';

export const routes: Routes = [
    { path: 'login', component: Login},
    { path: 'signup', component: Signup},
    { path: 'profile', component: Profile},
    { path: 'reset-password/:uid/:token', component: ResetPassword },
    { path: '**', component: Page404Comp },
];