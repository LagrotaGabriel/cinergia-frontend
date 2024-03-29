import { Endereco } from "src/app/shared/models/Endereco";
import { Telefone } from "src/app/shared/models/Telefone";
import { Acesso } from "./Acesso";
import { Arquivo } from "src/app/shared/models/Arquivo";
import { TableOptions } from "src/app/modules/shared/models/TableOptions";

export class ClienteResponse {
    id: number;
    dataCadastro: string;
    horaCadastro: string;
    nome: string;
    email: string;
    cpfCnpj: string;
    observacoes: string;
    statusCliente: string;
    dataNascimento: string;
    tipoPessoa: string;
    acessoSistema: Acesso;
    telefones: Telefone[];
    endereco: Endereco;
    fotoPerfil: Arquivo;
    checked: boolean;
    options: TableOptions;

    constructor(item) {
        this.id = item?.id;
        this.dataCadastro = item?.dataCadastro;
        this.horaCadastro = item?.horaCadastro;
        this.nome = item?.nome;
        this.email = item?.email;
        this.cpfCnpj = item?.cpfCnpj;
        this.observacoes = item?.observacoes;
        this.statusCliente = item?.statusCliente;
        this.dataNascimento = item?.dataNascimento;
        this.tipoPessoa = item?.tipoPessoa;
        this.acessoSistema = item?.acessoSistema;
        this.telefones = item?.telefones;
        this.endereco = item?.endereco;
        this.fotoPerfil = item?.fotoPerfil;
        this.checked = false;
        this.options = {
            detalhesHabilitado: true,
            editarHabilitado: true,
            removerHabilitado: false
        }
    }

    isChecked(): boolean {
        return this.checked;
    }
}