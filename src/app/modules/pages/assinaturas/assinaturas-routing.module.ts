import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisualizacaoComponent } from './visualizacao/visualizacao.component';
import { CriacaoComponent } from './criacao/criacao.component';
import { DetalhesComponent } from './detalhes/detalhes.component';

const routes: Routes = [
  {
    path: '',
    component: VisualizacaoComponent,
  },
  {
    path: 'novo',
    component: CriacaoComponent
  },
  {
    path: ':id',
    component: DetalhesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssinaturasRoutingModule {}
