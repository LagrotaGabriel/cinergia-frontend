export class CartaoRequest {
    private nomePortador: string;
    private cpfCnpjPortador: string;
    private numero: string;
    private mesExpiracao: number;
    private anoExpiracao: number;
    private ccv: number;

    constructor(item) {
        this.nomePortador = item?.nomePortador;
        this.cpfCnpjPortador = item?.cpfCnpjPortador;
        this.numero = item?.numero;
        this.mesExpiracao = item?.mesExpiracao;
        this.anoExpiracao = item?.anoExpiracao;
        this.ccv = item?.ccv;
    }
}