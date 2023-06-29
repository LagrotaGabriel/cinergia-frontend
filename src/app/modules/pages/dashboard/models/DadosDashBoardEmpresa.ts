export class DadosDashBoardEmpresa {

    saldo: string;
    atrasado: string;
    previsto: string;
    confirmado: string;
    qtdAssinaturasAtivas: number;
    qtdAssinaturasInativas: number;
    totalAssinaturas: number

    constructor(item) {
        this.saldo = item?.saldo;
        this.atrasado = item?.atrasado;
        this.previsto = item?.previsto;
        this.confirmado = item?.confirmado;
        this.qtdAssinaturasAtivas = item?.qtdAssinaturasAtivas;
        this.qtdAssinaturasInativas = item?.qtdAssinaturasInativas;
        this.totalAssinaturas = item?.totalAssinaturas;
    }
}