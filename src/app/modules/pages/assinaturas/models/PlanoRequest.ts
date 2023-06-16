export class PlanoRequest {
    id: number;
    idClienteResponsavel: number;
    dataInicio: string;
    descricao: string;
    valor: number;
    formaPagamento: string;
    periodicidade: string;

    constructor(item) {
        this.id = item?.id;
        this.idClienteResponsavel = item?.idClienteResponsavel;
        this.dataInicio = item?.dataInicio;
        this.descricao = item?.descricao;
        this.valor = item?.valor;
        this.formaPagamento = item?.formaPagamento;
        this.periodicidade = item?.periodicidade;
    }
    
}