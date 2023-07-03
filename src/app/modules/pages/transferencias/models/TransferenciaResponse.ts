export class TransferenciaResponse {
    dataCadastro: string;
    horaCadastro: string;
    descricao: string;
    valor: number;
    chavePix: string;
    tipoChavePix: string;

    constructor(item) {
        this.dataCadastro = item?.dataCadastro;
        this.horaCadastro = item?.horaCadastro;
        this.descricao = item?.descricao;
        this.valor = item?.valor;
        this.chavePix = item?.chavePix;
        this.tipoChavePix = item?.tipoChavePix;
    }
}