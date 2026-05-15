import { Routes } from '@angular/router';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { Usuarios } from './features/usuarios/usuarios';
import { Eventos } from './features/eventos/eventos';
import { Noticias } from './features/noticias/noticias';
import { Estadisticas } from './features/estadisticas/estadisticas';
import { Contacto } from './features/contacto/contacto';
import { Login } from './features/login/login';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },
    {
        path: '',
        component: AdminLayout,
        canActivate: [adminGuard],
        children: [
            { path: '', redirectTo: 'estadisticas', pathMatch: 'full' },
            { path: 'usuarios', component: Usuarios },
            { path: 'eventos', component: Eventos },
            { path: 'noticias', component: Noticias },
            { path: 'estadisticas', component: Estadisticas },
            { path: 'contacto', component: Contacto }
        ]
    },
    { path: '**', redirectTo: '' }
];
