import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidenavComponent } from './shared/sidenav/sidenav.component';
import { VisualizacaoComponent } from './modules/pages/login/visualizacao/visualizacao.component';
import { EmpresaGuard } from './auth/empresa.guard';

const routes: Routes = [
  {
    path: 'login',
    component: VisualizacaoComponent
  },
  {
    path: '',
    component: SidenavComponent,
    canActivate: [EmpresaGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./modules/pages/dashboard/dashboard-routing.module').then(m => m.DashboardRoutingModule)
      },
      {
        path: 'clientes',
        loadChildren: () => import('./modules/pages/clientes/clientes-routing.module').then(m => m.ClientesRoutingModule)
      },
      {
        path: 'assinaturas',
        loadChildren: () => import('./modules/pages/assinaturas/assinaturas-routing.module').then(m => m.AssinaturasRoutingModule)
      },
      {
        path: 'cobrancas',
        loadChildren: () => import('./modules/pages/pagamentos/pagamentos-routing.module').then(m => m.PagamentosRoutingModule)
      },
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
