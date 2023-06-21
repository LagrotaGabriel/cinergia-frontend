
export class DadosPlanoResponse {
    totalCobrancas: number;
    totalPendente: number;
    totalPago: number;
    totalEmAtraso: number;
    comprometimento: number;

    constructor(item) {
        this.totalCobrancas = item?.totalCobrancas;
        this.totalPendente = item?.totalPendente;
        this.totalPago = item?.totalPago;
        this.totalEmAtraso = item?.totalEmAtraso;
        this.comprometimento = item?.comprometimento;
    }

}