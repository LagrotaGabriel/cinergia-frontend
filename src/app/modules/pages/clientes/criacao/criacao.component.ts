import { ChangeDetectorRef, Component } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ClienteRequest } from '../models/ClienteRequest';
import { Telefone } from 'src/app/shared/models/Telefone';
import { Endereco } from 'src/app/shared/models/Endereco';
import { Util } from 'src/app/modules/utils/Util';
import { ClienteResponse } from '../models/ClienteResponse';

@Component({
  selector: 'app-criacao',
  templateUrl: './criacao.component.html',
  styleUrls: ['./criacao.component.scss']
})
export class CriacaoComponent {

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private ref: ChangeDetectorRef,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute) { }

  // Subscriptions
  novoClienteSubscription$: Subscription;
  atualizaClienteSubscription$: Subscription;
  obtemClientePorIdSubscription$: Subscription;

  // Form groups
  protected dadosCliente: FormGroup;
  protected dadosTelefone: FormGroup;
  protected telefones: Telefone[] = [];
  protected dadosEndereco: FormGroup;

  cliente: ClienteRequest;
  clientePreAtualizacao: ClienteResponse;

  stepAtual: number = 0;
  telefoneBuscadoCnpj: Telefone[];
  enderecoBuscadoCnpj: Endereco;

  titulo: string = 'Cadastrar novo cliente';
  idCliente: number = null;

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      if (params.has('id')) {
        this.titulo = 'Alterar cliente';
        let id = params.get('id');
        if (/^\d+$/.test(id)) {
          this.idCliente = parseInt(id);
          this.inicializaCliente(parseInt(id));
        }
        else {
          this.router.navigate(['/clientes']);
          this._snackBar.open("O cliente que você tentou editar não existe", "Fechar", {
            duration: 3500
          });
        }
      }
    });

  }

  ngAfterViewInit(): void {
    this.ref.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.novoClienteSubscription$ != undefined) this.novoClienteSubscription$.unsubscribe();
    if (this.atualizaClienteSubscription$ != undefined) this.atualizaClienteSubscription$.unsubscribe();
    if (this.obtemClientePorIdSubscription$ != undefined) this.obtemClientePorIdSubscription$.unsubscribe();
  }

  mudaPasso(event) {
    this.stepAtual = event.selectedIndex;
  }

  protected getValueAtributoDadosCliente(atributo: string): any {
    return this.dadosCliente.controls[atributo].value;
  }

  protected getValueAtributoDadosEndereco(atributo: string): any {
    return this.dadosEndereco.controls[atributo].value;
  }

  // MÉTODOS DE ATUALIZAÇÃO DE CLIENTE

  inicializaCliente(id: number) {
    this.obtemClientePorIdSubscription$ = this.clienteService.obtemClientePorId(id).subscribe({
      next: (cliente: ClienteResponse) => {
        console.log(cliente);
        this.clientePreAtualizacao = cliente;
        this.cliente = this.clientePreAtualizacao;
      }
    })
  }

  // FUNÇÕES QUE RECEBEM EMISSÃO DE EVENTOS DOS COMPONENTES FILHOS

  protected recebeFormGroupDadosPessoais(event) {
    console.log('Recebendo dados pessoais')
    this.dadosCliente = event;
  }

  protected recebeFormGroupDadosTelefone(event) {
    console.log('Recebendo dados de telefone')
    this.telefones = event;
  }

  protected recebeFormGroupDadosEndereco(event) {
    console.log('Recebendo dados de endereço')
    this.dadosEndereco = event;
  }

  protected recebeTelefoneEncontradoNoCnpj(telefone: Telefone[]) {
    console.log('Recebendo telefone encontrado pelo CNPJ');
    this.telefoneBuscadoCnpj = telefone;
  }

  protected recebeEnderecoEncontradoNoCnpj(endereco: Endereco) {
    console.log('Recebendo endereço encontrado pelo CNPJ');
    this.enderecoBuscadoCnpj = endereco;
  }

  private constroiObjetoCliente() {
    this.cliente = {
      id: this.idCliente,
      nome: this.getValueAtributoDadosCliente('nome'),
      email: Util.isNotEmptyString(this.getValueAtributoDadosCliente('email')) ? this.getValueAtributoDadosCliente('email') : null,
      cpfCnpj: Util.isNotEmptyString(this.getValueAtributoDadosCliente('cpfCnpj')) ? this.getValueAtributoDadosCliente('cpfCnpj') : null,
      statusCliente: this.getValueAtributoDadosCliente('statusCliente'),
      dataNascimento: Util.isNotEmptyString(this.getValueAtributoDadosCliente('dataNascimento')) ? this.getValueAtributoDadosCliente('dataNascimento') : null,
      tipoPessoa: this.getValueAtributoDadosCliente('tipoPessoa'),
      telefones: this.telefones,
      endereco: Util.isNotEmptyString(this.getValueAtributoDadosEndereco('logradouro'))
        ? {
          codigoPostal: Util.isNotEmptyString(this.getValueAtributoDadosEndereco('codigoPostal')) ? this.getValueAtributoDadosEndereco('codigoPostal') : null,
          estado: Util.isNotEmptyString(this.getValueAtributoDadosEndereco('estado')) ? this.getValueAtributoDadosEndereco('estado') : null,
          cidade: Util.isNotEmptyString(this.getValueAtributoDadosEndereco('cidade')) ? this.getValueAtributoDadosEndereco('cidade') : null,
          logradouro: Util.isNotEmptyString(this.getValueAtributoDadosEndereco('logradouro')) ? this.getValueAtributoDadosEndereco('logradouro') : null,
          numero: Util.isNotEmptyString(this.getValueAtributoDadosEndereco('numero')) ? this.getValueAtributoDadosEndereco('numero') : null,
          bairro: Util.isNotEmptyString(this.getValueAtributoDadosEndereco('bairro')) ? this.getValueAtributoDadosEndereco('bairro') : null,
          complemento: Util.isNotEmptyString(this.getValueAtributoDadosEndereco('complemento')) ? this.getValueAtributoDadosEndereco('complemento') : null
        }
        : null,
    }
  }

  // SUBMIT
  public direcionaEnvioDeFormulario() {
    this.constroiObjetoCliente();
    if (Util.isNotEmptyString(this.getValueAtributoDadosCliente('dataNascimento')))
      this.cliente.dataNascimento = this.datePipe.transform(this.getValueAtributoDadosCliente('dataNascimento'), "yyyy-MM-dd");

    if (this.dadosCliente.valid && this.dadosEndereco.valid) {
      if (Util.isEmptyNumber(this.idCliente)) this.enviaFormularioNovoCliente();
      else this.enviaFormularioAtualizaCliente();
    }
  }

  private enviaFormularioNovoCliente() {
    this.novoClienteSubscription$ =
      this.clienteService.novoCliente(this.cliente).subscribe({
        error: error => {
          this._snackBar.open("Ocorreu um erro ao cadastrar o cliente", "Fechar", {
            duration: 3500
          })
        },
        complete: () => {
          this.router.navigate(['/clientes']);
          this._snackBar.open("Cliente cadastrado com sucesso", "Fechar", {
            duration: 3500
          });
        }
      });
  }

  private enviaFormularioAtualizaCliente() {
    this.atualizaClienteSubscription$ =
      this.clienteService.atualizaCliente(this.idCliente, this.cliente).subscribe({
        error: error => {
          this._snackBar.open("Ocorreu um erro ao atualizar o cliente", "Fechar", {
            duration: 3500
          })
        },
        complete: () => {
          this.router.navigate(['/clientes']);
          this._snackBar.open("Cliente atualizado com sucesso", "Fechar", {
            duration: 3500
          });
        }
      });
  }

}
