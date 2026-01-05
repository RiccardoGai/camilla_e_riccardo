
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { WeddingComponent } from './components/wedding/wedding.component';
import { authGuard } from './guards/auth.guard';

export const APP_ROUTES: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        title: 'Accesso | Camilla & Riccardo'
    },
    {
        path: '',
        component: WeddingComponent,
        canActivate: [authGuard],
        title: 'Camilla & Riccardo | 20.06.2026'
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];
