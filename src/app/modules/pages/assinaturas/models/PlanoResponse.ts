export class PlanoResponse {
    id: number;
    dataCadastro: string;
    horaCadastro: string;
    descricao: string;
    valor: number;
    dataVencimento: string;
    formaPagamento: string;
    statusPlano: string;
    checked: boolean;

    constructor(item) {
        this.id = item?.id;
        this.dataCadastro = item?.dataCadastro;
        this.horaCadastro = item?.horaCadastro;
        this.descricao = item?.descricao;
        this.valor = item?.valor;
        this.dataVencimento = item?.dataVencimento;
        this.formaPagamento = item?.formaPagamento;
        this.statusPlano = item?.statusPlano;
        this.checked = false;
    }
    
}