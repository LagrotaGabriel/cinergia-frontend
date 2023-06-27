import { TableOptions } from "src/app/modules/shared/models/TableOptions";

export class PlanoResponse {
    id: number;
    dataCadastro: string;
    horaCadastro: string;
    dataVencimento: string;
    dataInicio: string;
    descricao: string;
    valor: number;
    formaPagamento: string;
    statusPlano: string;
    periodicidade: string;
    notificacoes: string[];
    checked: boolean;
    expandido: boolean;
    options: TableOptions;

    constructor(item) {
        this.id = item?.id;
        this.dataCadastro = item?.dataCadastro;
        this.horaCadastro = item?.horaCadastro;
        this.dataVencimento = item?.dataVencimento;
        this.dataInicio = item?.dataInicio;
        this.descricao = item?.descricao;
        this.valor = item?.valor;
        this.formaPagamento = item?.formaPagamento;
        this.statusPlano = item?.statusPlano;
        this.periodicidade = item?.periodicidade;
        this.notificacoes = item?.notificacoes;
        this.checked = false;
        this.expandido = false;
        this.options = {
            detalhesHabilitado: true,
            editarHabilitado: true,
            removerHabilitado: false
        }
    }
    
}