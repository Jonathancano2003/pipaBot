import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ChatComponent } from './chat/chat.component';
import { authGuard } from './auth.guard';
import { AdminComponent } from './admin/admin.component';
export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {path: 'login', component: LoginComponent},
    { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
    { path: 'chat', component: ChatComponent, canActivate: [authGuard] },
    { path: 'admin', component: AdminComponent },
];
