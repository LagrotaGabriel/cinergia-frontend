import { FaturamentosRoutingModule } from './modules/pages/faturamentos/faturamentos-routing.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidenavComponent } from './shared/sidenav/sidenav.component';

const routes: Routes = [
  {
    path: '',
    component: SidenavComponent,
    children: [
      {
        path: 'clientes',
        loadChildren: () => import('./modules/pages/clientes/clientes-routing.module').then(m => m.ClientesRoutingModule)
      },
      {
        path: 'assinaturas',
        loadChildren: () => import('./modules/pages/assinaturas/assinaturas-routing.module').then(m => m.AssinaturasRoutingModule)
      },
      {
        path: 'faturamento',
        loadChildren: () => import('./modules/pages/faturamentos/faturamentos-routing.module').then(m => m.FaturamentosRoutingModule)
      },
    ]
  },
  {
    path: '**',
    redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
