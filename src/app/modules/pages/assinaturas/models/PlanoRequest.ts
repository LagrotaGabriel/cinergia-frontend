export class PlanoRequest {
    id: number;
    idClienteResponsavel: number;
    descricao: string;
    valor: number;
    dataVencimento: string;
    formaPagamento: string;
    statusPlano: string;

    constructor(item) {
        this.id = item?.id;
        this.idClienteResponsavel = item?.idClienteResponsavel;
        this.descricao = item?.descricao;
        this.valor = item?.valor;
        this.dataVencimento = item?.dataVencimento;
        this.formaPagamento = item?.formaPagamento;
        this.statusPlano = item?.statusPlano;
    }
    
}