export class Notificacao {
    dataCadastro: string;
    horaCadastro: string;
    descricao: string;
    uri: string;
    lida: boolean;
    tipoNotificacao: string;

    constructor(item) {
        this.dataCadastro = item?.dataCadastro;
        this.horaCadastro = item?.horaCadastro;
        this.descricao = item?.descricao;
        this.uri = item?.uri;
        this.lida = item?.lida;
        this.tipoNotificacao = item?.tipoNotificacao;
    }
}