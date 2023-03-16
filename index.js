import { useQuestion } from './src/services/question/use-question'
import axios from 'axios'

let sair = false
let login = null

const menuInicial = {
    "Login": async () => {
        let loginValido = false
        //do{
            const email = await useQuestion('Email: ')
            const senha = await useQuestion('Senha: ')
            // select para ver se o email corresponde com a senha

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
        //}while(!loginValido)
        
    },
    "Registrar-se": () => {

    }
}

const menuSteam = {

    "Perfil": async () => {

    },
    "Loja": async () => {
        await axios.get('http://localhost:3001/loja', {

        }).then((res) => {
            console.log(res.data)
        })
    },
    "Inventário": async () => {

    },
    "Mercado da Comunidade": async () => {
        
    }
}

let menuAtual = menuInicial

const main = async () => {

    console.log('\nBem-vindo à Steam')

    while(!sair){
        if(login){
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
            console.log('\nOpção não encontrada.')
        } else {
            await acao()
        }

    }
}

//main()
