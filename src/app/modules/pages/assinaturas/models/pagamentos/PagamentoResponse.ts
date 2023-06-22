import { TableOptions } from "src/app/modules/shared/models/TableOptions";

export class PagamentoResponse {
    dataCadastro: string;
    horaCadastro: string;
    valorBruto: number;
    valorLiquido: number;
    descricao: string;
    dataVencimento: string;
    linkCobranca: string;
    linkBoletoAsaas: string;
    formaPagamento: string;
    statusPagamento: string;
    expandido: boolean;
    options: TableOptions;

    constructor(item) {
        this.dataCadastro = item?.dataCadastro;
        this.horaCadastro = item?.horaCadastro;
        this.valorBruto = item?.valorBruto;
        this.valorLiquido = item?.valorLiquido;
        this.descricao = item?.descricao;
        this.dataVencimento = item?.dataVencimento;
        this.linkCobranca = item?.linkCobranca;
        this.linkBoletoAsaas = item?.linkBoletoAsaas;
        this.formaPagamento = item?.formaPagamento;
        this.statusPagamento = item?.statusPagamento;
        this.expandido = false;
        this.options = {
            detalhesHabilitado: true,
            editarHabilitado: true,
            removerHabilitado: false
        }
    }
}