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
         * select da loja
         * é possivel comprar um jogo (adicionar a biblioteca do usuario)
         * verifica se já possui o jogo
         * desconta valor do jogo
         */
        await axios.get('http://localhost:3001/loja', {

        }).then((res) => {
            console.log(res.data)
        })
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

let menuAtual = menuInicial

const main = async () => {

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


