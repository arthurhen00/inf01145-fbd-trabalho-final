import { useQuestion } from './src/services/question/use-question'
import axios from 'axios'

let sair = false
let login = null

const menuInicial = {
    "Login": async () => {
        /**
         * Verifica as credenciais com o banco
         * altera o menu
         */
    let loginValido = false
        const email = await useQuestion('Email: ')
        const senha = await useQuestion('Senha: ')

        await axios.post('http://localhost:3001/login', {
            email: email,
            senha: senha
        }).then((res) => {
            if(res.data.rows.length === 1){
                loginValido = true
                login = res.data.rows[0].login
                menuAtual = menuSteam
            }
        })
        if(!loginValido){
            console.log('\nLogin inválido.')
        } 
        
    },
    "Registrar-se": async () => {
        /**
         * Adiciona um usuario (nao registrado) no db
         */
        const login = await useQuestion('Login: ')
        const email = await useQuestion('Email: ')
        const senha = await useQuestion('Senha: ')

        await axios.post('http://localhost:3001/registrar', {
            login: login,
            email: email,
            senha: senha
        }).then((res) => {
            if(res.data){
                console.log('\nCadastrado.')
            } else {
                console.log('\nLogin ou email em uso.')
            }
        })
    }
}

const menuSteam = {

    "Perfil": async () => {
        /**
         * Lista informações do usuario
         * É possivel altera-las
         */
    },
    "Minha biblioteca": async () => {
        /**
         * Listar meus jogos
         * Posso entrar em jogo
         * Jogar -> altera o tempo
         */
    },
    "Loja": async () => {
        /**
         * Opções:
         * Listar jogos
         * Listar jogos com o nome X
         * Listar jogos com o genero X
         * é possivel adicionar um jogo ao carrinho (pedido)
         * nao deve ser possivel adicionar um jogo que já está no carrinho ou na biblioteca
         */
        menuAtual = menuLoja
    },
    "Carrinho": async () => {
        /**
         * Opções:
         * Remover
         * Comprar
         */
    },
    "Inventário": async () => {

    },
    "Mercado da Comunidade": async () => {
        
    },
    "Sair": async () => {
        login = null
        menuAtual = menuInicial
    }
}

const menuLoja = {
    "Listar jogos": async () => {
        await axios.post('http://localhost:3001/loja')
        .then((res) => {
            console.table(res.data)
        })
        const email = await useQuestion('Qual jogo você deseja adicionar ao carrinho?1 (ID): ')
    },
    "Listar jogos por nome: ": async () => {
        const nome = await useQuestion('Nome do jogo: ')
        
        await axios.post('http://localhost:3001/loja', {
            nome: nome
        })
        .then((res) => {
            console.table(res.data)
        })
        const email = await useQuestion('Qual jogo você deseja adicionar ao carrinho?2 (ID): ')
    },
    "Listar jogos por genero: ": async () => {
        const genero = await useQuestion('Genero do jogo: ')
        
        await axios.post('http://localhost:3001/loja', {
            genero: genero
        })
        .then((res) => {
            console.table(res.data)
        })
        const email = await useQuestion('Qual jogo você deseja adicionar ao carrinho?3 (ID): ')
    },
    "Voltar": () => {
        menuAtual = menuSteam
    }
}

let menuAtual = menuInicial

const main = async () => {
    console.clear()
    console.log('\nBem-vindo à Steam')

    while(!sair){
        if(login){
            console.clear()
            console.log('\nUsuário logado: ' + login)
        }
        console.log('\nEscolha uma das opções: ')
        const opcoes = Object.keys(menuAtual)
        opcoes.forEach((item, index) => {
            console.log(`${index+1}: ${item}`)
        })
        const escolha = await useQuestion('\nDigite a sua escolha: ')
        const nomeAcao = opcoes[escolha-1]
        const acao = menuAtual[nomeAcao]
        if(!acao){
            console.clear()
            console.log('\nOpção não encontrada.')
        } else {
            console.clear()
            await acao()
        }

    }
}

main()


