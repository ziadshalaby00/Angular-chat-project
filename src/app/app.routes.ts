import { Routes } from '@angular/router';
import { Login } from './auth-components/login/login';
import { Signup } from './auth-components/signup/signup';
import { ResetPassword } from './auth-components/reset-password/reset-password';
import { Page404Comp } from './other-components/page404/page404';
import { Profile } from './profile-components/profile/profile';
import { InitPage } from './other-components/init-page/init-page';
import { Home } from './other-components/home/home';
import { Chats } from './chats-components/chats/chats';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: Home},
    { path: 'chats', component: Chats},
    { path: 'login', component: Login},
    { path: 'signup', component: Signup},
    { path: 'profile/:user_id', component: Profile},
    { path: 'reset-password/:uid/:token', component: ResetPassword },
    { path: 'init-page', component: InitPage },
    { path: '**', component: Page404Comp },
];