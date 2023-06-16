export class PlanoResponse {
    id: number;
    dataCadastro: string;
    horaCadastro: string;
    dataInicio: string;
    descricao: string;
    valor: number;
    formaPagamento: string;
    statusPlano: string;
    periodicidade: string;
    checked: boolean;

    constructor(item) {
        this.id = item?.id;
        this.dataCadastro = item?.dataCadastro;
        this.horaCadastro = item?.horaCadastro;
        this.dataInicio = item?.dataInicio;
        this.descricao = item?.descricao;
        this.valor = item?.valor;
        this.formaPagamento = item?.formaPagamento;
        this.statusPlano = item?.statusPlano;
        this.periodicidade = item?.periodicidade;
        this.checked = false;
    }
    
}