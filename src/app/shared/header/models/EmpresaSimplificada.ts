export class EmpresaSimplificada {
    nome: string;
    saldo: number;

    constructor(item) {
        this.nome = item?.nomeEmpresa;
        this.saldo = item?.saldo;
    }
}