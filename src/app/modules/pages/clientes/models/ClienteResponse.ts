import { Endereco } from "src/app/shared/models/Endereco";
import { Telefone } from "src/app/shared/models/Telefone";
import { Acesso } from "./Acesso";

export class ClienteResponse {
    id: number;
    dataCadastro: string;
    horaCadastro: string;
    nome: string;
    email: string;
    cpfCnpj: string;
    statusCliente: string;
    dataNascimento: string;
    tipoPessoa: string;
    acessoSistema: Acesso;
    telefones: Telefone[];
    endereco: Endereco;
    checked: boolean;

    constructor(item) {
        this.id = item?.id;
        this.dataCadastro = item?.dataCadastro;
        this.horaCadastro = item?.horaCadastro;
        this.nome = item?.nome;
        this.email = item?.email;
        this.cpfCnpj = item?.cpfCnpj;
        this.statusCliente = item?.statusCliente;
        this.dataNascimento = item?.dataNascimento;
        this.tipoPessoa = item?.tipoPessoa;
        this.acessoSistema = item?.acessoSistema;
        this.telefones = item?.telefones;
        this.endereco = item?.endereco;
        this.checked = false;
    }

    isChecked(): boolean {
        return this.checked;
    }
}