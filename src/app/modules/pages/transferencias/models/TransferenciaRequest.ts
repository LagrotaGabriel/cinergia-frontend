export class TransferenciaRequest {
    descricao: string;
    valor: number;
    chavePix: string;
    tipoChavePix: string;

    constructor(item) {
        this.descricao = item?.descricao;
        this.valor = item?.valor;
        this.chavePix = item?.chavePix;
        this.tipoChavePix = item?.tipoChavePix;
    }
}