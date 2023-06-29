export class EmpresaSimplificada {
    nome: string;
    saldo: string;

    constructor(item) {
        this.nome = item?.nomeEmpresa;
        this.saldo = item?.saldo;
    }
}