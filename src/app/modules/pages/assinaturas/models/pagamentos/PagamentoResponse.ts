export class PagamentoResponse {
    dataCadastro: string;
    horaCadastro: string;
    valorBruto: number;
    valorLiquido: number;
    descricao: string;
    dataVencimento: string;
    formaPagamento: string;
    statusPagamento: string;

    constructor(item) {
        this.dataCadastro = item?.dataCadastro;
        this.horaCadastro = item?.horaCadastro;
        this.valorBruto = item?.valorBruto;
        this.valorLiquido = item?.valorLiquido;
        this.descricao = item?.descricao;
        this.dataVencimento = item?.dataVencimento;
        this.formaPagamento = item?.formaPagamento;
        this.statusPagamento = item?.statusPagamento;
    }
}