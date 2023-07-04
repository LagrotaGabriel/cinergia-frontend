import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { SidenavComponent } from './shared/sidenav/sidenav.component';
import { HeaderComponent } from './shared/header/header.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTreeModule } from '@angular/material/tree';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ClientesModule } from './modules/pages/clientes/clientes.module';
import { DatePipe } from '@angular/common';
import { AssinaturasModule } from './modules/pages/assinaturas/assinaturas.module';
import { PagamentosModule } from './modules/pages/pagamentos/pagamentos.module';
import { DashboardModule } from './modules/pages/dashboard/dashboard.module';
import { LoginModule } from './modules/pages/login/login.module';
import { NovaTransferenciaComponent } from './shared/header/nova-transferencia/nova-transferencia.component';
import { SharedModule } from './modules/shared/shared.module';
import { DadosPixComponent } from './shared/header/nova-transferencia/dados-pix/dados-pix.component';
import { ConfirmaPixComponent } from './shared/header/nova-transferencia/confirma-pix/confirma-pix.component';
import { PixFinalizadoComponent } from './shared/header/nova-transferencia/pix-finalizado/pix-finalizado.component';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    HeaderComponent,
    NovaTransferenciaComponent,
    DadosPixComponent,
    ConfirmaPixComponent,
    PixFinalizadoComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatSidenavModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatTooltipModule,
    MatRippleModule,
    MatBadgeModule,
    MatToolbarModule,
    MatMenuModule,
    MatDialogModule,
    MatTreeModule,
    MatExpansionModule,
    ClientesModule,
    AssinaturasModule,
    PagamentosModule,
    DashboardModule,
    LoginModule,
    SharedModule,
    HttpClientModule,
    MatStepperModule,
    MatProgressSpinnerModule
  ],

  providers: [DatePipe, { provide: Window, useValue: window }],
  bootstrap: [AppComponent],
})
export class AppModule { }
