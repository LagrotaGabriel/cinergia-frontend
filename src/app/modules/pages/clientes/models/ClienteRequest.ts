import { Arquivo } from 'src/app/shared/models/Arquivo';
import { Acesso } from './Acesso';
import { Endereco } from "src/app/shared/models/Endereco";
import { Telefone } from "src/app/shared/models/Telefone";

export class ClienteRequest {
    id: number;
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

    constructor(item) {
        this.id = item?.id;
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
    }
    
}