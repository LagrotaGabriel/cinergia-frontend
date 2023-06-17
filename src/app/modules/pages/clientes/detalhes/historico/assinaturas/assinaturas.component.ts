import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlanoPageObject } from 'src/app/modules/pages/assinaturas/models/PlanoPageObject';
import { PlanoService } from 'src/app/modules/pages/services/plano.service';
import { Util } from 'src/app/modules/utils/Util';

@Component({
  selector: 'app-assinaturas',
  templateUrl: './assinaturas.component.html',
  styleUrls: ['./assinaturas.component.scss']
})
export class AssinaturasComponent {

  constructor(
    private planoService: PlanoService,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private router: Router) {
  }

  @Input() abaSelecionada;

  protected planos: PlanoPageObject;

  protected getPlanosSubscription$: Subscription;

  ngAfterViewInit(): void {
    this.realizaObtencaoDosPlanosDoCliente();
  }

  realizaObtencaoDosPlanosDoCliente() {
    this.getPlanosSubscription$ = this.planoService.getPlanosCliente(Util.isNotObjectEmpty(this.planos) ? this.planos : null,
      parseInt(this.activatedRoute.snapshot.paramMap.get('id'))).subscribe({
        next: (resposta => {
          this.planos = resposta;
        }),
        error: () => {
          this.router.navigate(['/clientes/' + this.activatedRoute.snapshot.paramMap.get('id')]);
        }
      })
  }

  // ==================== PAGINAÇÃO ==========================

  GeraNumerosParaNavegarNaPaginacao(n: number): Array<number> {
    return Array(n);
  }

  selecionarPagina(numeroPagina: number) {
    this.planos.pageNumber = numeroPagina;
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
    if (this.planos.pageNumber > 0) {
      this.planos.pageNumber--;
      this.realizaObtencaoDosPlanosDoCliente();
    }
  }

  avancarPagina() {
    if (this.planos.pageNumber < this.planos.totalPages - 1) {
      this.planos.pageNumber++;
      this.realizaObtencaoDosPlanosDoCliente();
    }
  }

}
