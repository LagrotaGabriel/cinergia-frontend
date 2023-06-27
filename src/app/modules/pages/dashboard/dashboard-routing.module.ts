import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisualizacaoComponent } from './visualizacao/visualizacao.component';

const routes: Routes = [
    {
        path: '',
        component: VisualizacaoComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DashboardRoutingModule { }
