import { CartaoRequest } from "./CartaoRequest";

export class PlanoRequest {
    id: number;
    dataInicio: string;
    descricao: string;
    valor: number;
    formaPagamento: string;
    periodicidade: string;
    notificacoes: string[];
    cartao: CartaoRequest;

    constructor(item) {
        this.id = item?.id;
        this.dataInicio = item?.dataInicio;
        this.descricao = item?.descricao;
        this.valor = item?.valor;
        this.formaPagamento = item?.formaPagamento;
        this.periodicidade = item?.periodicidade;
        this.notificacoes = item?.notificacoes;
        this.cartao = item?.cartao;
    }
    
}