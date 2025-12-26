import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { ResetPassword } from './reset-password/reset-password';
import { Page404Comp } from './page404/page404';
import { Profile } from './profile/profile';
import { InitPage } from './init-page/init-page';
import { Chat } from './chat/chat';
import { Home } from './home/home';
import { Chats } from './chats/chats';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: Home},
    { path: 'chats', component: Chats},
    { path: 'login', component: Login},
    { path: 'signup', component: Signup},
    { path: 'profile/:user_id', component: Profile},
    { path: 'reset-password/:uid/:token', component: ResetPassword },
    { path: 'init-app', component: InitPage },
    { path: '**', component: Page404Comp },
];