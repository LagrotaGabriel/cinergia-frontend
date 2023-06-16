import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlanoService } from '../../services/plano.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-criacao',
  templateUrl: './criacao.component.html',
  styleUrls: ['./criacao.component.scss']
})
export class CriacaoComponent {
  constructor(private formBuilder: FormBuilder,
    private planoService: PlanoService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private ref: ChangeDetectorRef) { }

  titulo: string = 'Cadastrar nova assinatura';
  protected dadosPlano: FormGroup = this.createFormDadosCliente();

  createFormDadosCliente(): FormGroup {
    return this.formBuilder.group({
      nome: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  retornaParaVisualizacaoDePlanos() {
    this.router.navigate(['/assinaturas'])
  }
}
