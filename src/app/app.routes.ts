import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { ResetPassword } from './reset-password/reset-password';
import { Page404Comp } from './page404/page404';
import { Profile } from './profile/profile';
import { InitPage } from './init-page/init-page';

export const routes: Routes = [
    { path: 'login', component: Login},
    { path: 'signup', component: Signup},
    { path: 'profile/:user_id', component: Profile},
    { path: 'reset-password/:uid/:token', component: ResetPassword },
    { path: 'init-app', component: InitPage },
    { path: '**', component: Page404Comp },
];