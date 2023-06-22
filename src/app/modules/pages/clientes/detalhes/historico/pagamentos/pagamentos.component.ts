import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PagamentoPageObject } from 'src/app/modules/pages/assinaturas/models/pagamentos/PagamentoPageObject';
import { PagamentoService } from 'src/app/modules/pages/services/pagamento.service';
import { Util } from 'src/app/modules/utils/Util';
import { slideUpDownAnimation } from 'src/app/shared/animations';

@Component({
  selector: 'app-pagamentos',
  templateUrl: './pagamentos.component.html',
  styleUrls: ['./pagamentos.component.scss'],
  animations: [slideUpDownAnimation]
})
export class PagamentosComponent {

  constructor(
    private pagamentoService: PagamentoService,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private router: Router) {
  }

  @Input() abaSelecionada;

  protected pagamentos: PagamentoPageObject;

  protected getPagamentosSubscription$: Subscription;

  ngAfterViewInit(): void {
    this.realizaObtencaoDosPlanosDoCliente();
  }

  realizaObtencaoDosPlanosDoCliente() {
    this.getPagamentosSubscription$ = this.pagamentoService.getPagamentosCliente(Util.isNotObjectEmpty(this.pagamentos) ? this.pagamentos : null,
      parseInt(this.activatedRoute.snapshot.paramMap.get('id'))).subscribe({
        next: (resposta => {
          this.pagamentos = resposta;
        }),
        error: () => {
          this.router.navigate(['/clientes/' + this.activatedRoute.snapshot.paramMap.get('id')]);
        }
      })
  }

  realizaTratamentoFormaPagamento(formaPagamento: string): string {
    switch(formaPagamento) {
      case('BOLETO'): {
        return 'boleto';
      }
      case('PIX'): {
        return 'pix';
      }
      case('DEBIT_CARD'): {
        return 'cartão de débito';
      }
      case('CREDIT_CARD'): {
        return 'cartão de crédito';
      }
      default: {
        return 'indefinido';
      }
    }
  }

  // ==================== PAGINAÇÃO ==========================

  GeraNumerosParaNavegarNaPaginacao(n: number): Array<number> {
    return Array(n);
  }

  selecionarPagina(numeroPagina: number) {
    this.pagamentos.pageNumber = numeroPagina;
    this.realizaObtencaoDosPlanosDoCliente();
  }

  geraBotaoVoltarPaginacao(): string {
    if (window.innerWidth > 340) return 'Voltar'
    else return '<';
  }

  geraBotaoAvancarPaginacao(): string {
    if (window.innerWidth > 340) return 'Próximo'
    else return '>';
  }

  voltarPagina() {
    if (this.pagamentos.pageNumber > 0) {
      this.pagamentos.pageNumber--;
      this.realizaObtencaoDosPlanosDoCliente();
    }
  }

  avancarPagina() {
    if (this.pagamentos.pageNumber < this.pagamentos.totalPages - 1) {
      this.pagamentos.pageNumber++;
      this.realizaObtencaoDosPlanosDoCliente();
    }
  }

  encaminhaParaCriacaoDeNovaAssinatura() {
    this.router.navigate(
      ['/assinaturas/update/' + this.activatedRoute.snapshot.paramMap.get('id')]
    );
  }

}
