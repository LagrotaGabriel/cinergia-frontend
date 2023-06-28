import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fadeInOutAnimation, slideUpDownAnimation } from 'src/app/shared/animations';
import { EmpresaService } from '../../services/empresa.service';
import { Login } from '../models/Login';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-visualizacao',
  templateUrl: './visualizacao.component.html',
  styleUrls: ['./visualizacao.component.scss'],
  animations: [fadeInOutAnimation, slideUpDownAnimation]
})
export class VisualizacaoComponent {

  constructor(private formBuilder: FormBuilder,
    private empresaService: EmpresaService, 
    private snackBar: MatSnackBar,
    private router: Router) { }


  protected dadosLogin: FormGroup = this.createFormDadosLogin();

  createFormDadosLogin(): FormGroup {
    return this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  private criaObjetoLogin(): Login {
    let login: Login = {
      username: this.dadosLogin.controls['username'].value,
      password: this.dadosLogin.controls['password'].value
    }
    return login;
  }

  realizarLogin() {

    if (this.dadosLogin.invalid) {
      this.snackBar.open('Os campos de login não podem estar vazios', 'Fechar', {
        duration: 5000
      })
      this.dadosLogin.markAllAsTouched();
    }

    else {
      this.empresaService.realizaLogin(this.criaObjetoLogin()).subscribe({
        next: (response => {
          localStorage.setItem('Authorization', JSON.stringify(response.headers.get('Authorization')));
        }),
        complete: () => {
          this.router.navigate(['/dashboard']);
          this.snackBar.open('Login realizado com sucesso', 'Fechar', {
            duration: 3500
          })
        }
      })
    }
  }
}
