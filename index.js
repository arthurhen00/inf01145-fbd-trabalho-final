import { useQuestion } from './src/services/question/use-question'
import axios from 'axios'

let sair = false
let login = null
let dev = false
let listaCarrinho = null

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
            if(res.data[0].length === 1){
                loginValido = true
                login = res.data[0][0].login
                dev = res.data[1]
                menuAtual = menuSteam
            }
        })
        if(!loginValido){
            console.log('\nLogin inválido.')
        } 
        console.clear()
    },
    "Registrar-se": async () => {
        /**
         * Adiciona um usuario (nao registrado) no db
         */
        const login = await useQuestion('Login: ')
        const email = await useQuestion('Email: ')
        const senha = await useQuestion('Senha: ')

        if(login.length > 0 && email.length > 0 && senha.length > 0){
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
}

const menuSteam = {
    "Perfil": async () => {
        /**
         * Lista informações do usuario
         * É possivel altera-las
         * Login, email, apelido*, nome*, pais*, saldo*
         */
        console.log('Meu perfil:')
        await axios.post('http://localhost:3001/perfil', {
            login: login
        })
        .then( async (res) => {
            console.log('Login: ' + res.data[0].login)
            console.log('Email: ' + res.data[0].email)
            console.log('Apelido: ' + res.data[0].apelido)
            console.log('Nome: ' + res.data[0].nome)
            console.log('País: ' + res.data[0].pais)
            console.log('Saldo: ' + res.data[0].saldo)

            menuAtual = menuPerfil
        })
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
         * Lista o carrinho
         * Opcao de finalizar compra
         * Opcao para remover
         * Comprar -> saldo -> remove do carrinho -> cria o pedido -> adiciona na lib
         */
        let carrinhoVazio = false
        console.log('Meu carrinho:')
        await axios.post('http://localhost:3001/listar-carrinho', {
            login: login
        })
        .then((res) => {
            if(res.data.length > 0){
                listaCarrinho = res.data
                console.table(listaCarrinho)
            } else {
                console.log('\nCarrinho vazio!')
                carrinhoVazio = true
            }
        })
        if(!carrinhoVazio){
            menuAtual = menuCarrinho
        }
    },
    "Minha biblioteca": async () => {
        /**
         * Listar meus jogos
         * Posso entrar em jogo
         * Jogar -> altera o tempo
         */
    },
    "Inventário": async () => {

    },
    "Mercado da Comunidade": async () => {
        
    },
    "Histórico de compras": async () => {
        /**
         * Menu com id e data dos pedido
         * Escolher um id leva para os itens que estao nesse pedido
         */
        let idSelecionado
        let pedidoSelecionado
        let listaPedido

        console.log('\nEsse é o seu histórico de compras:')

        await axios.post('http://localhost:3001/meus-pedidos', {
            login: login
        })
        .then((res) => {
            listaPedido = res.data
            console.table(listaPedido)
        })

        do{
            idSelecionado = await useQuestion('\nGostaria de ver as informações de qual pedido?')
            pedidoSelecionado = Boolean(listaPedido.find(({ idpedido }) => idpedido == idSelecionado))
            if(!pedidoSelecionado){
                console.log('\nEsse pedido não é seu!.')
            }
        }while(!pedidoSelecionado)

        console.log('Informações do pedio ' + idSelecionado + ':')
        await axios.post('http://localhost:3001/meus-pedidos/conteudo', {
            idPedido: idSelecionado
        })
        .then((res) => {
            console.table(res.data)
        })

        const placeHolder = await useQuestion('\nVoltar')
        console.clear()
    },
    "Minhas publicações": async () => {

    },
    "Menu de Desenvolvedor": async () => {
        menuAtual = menuDesenvolvedor
    },
    "Sair": async () => {
        login = null
        dev = false
        listaCarrinho = null
        menuAtual = menuInicial
    }
}

const menuPerfil = {
    "Alterar apelido": async () => {
        const novoApelido = await useQuestion('Novo apelido: ')
        await axios.post('http://localhost:3001/alterar-informacoes', {
            novoApelido: novoApelido,
            login: login
        })
        .then((res) => {
            console.table(res.data)
        })
    },
    "Alterar nome": async () => {
        const novoNome = await useQuestion('Novo nome: ')
        await axios.post('http://localhost:3001/alterar-informacoes', {
            novoNome: novoNome,
            login: login
        })
        .then((res) => {
            console.table(res.data)
        })
    },
    "Alterar país": async () => {
        const novoPais = await useQuestion('Novo país: ')
        await axios.post('http://localhost:3001/alterar-informacoes', {
            novoPais: novoPais,
            login: login
        })
        .then((res) => {
            console.table(res.data)
        })
    },
    "Adicionar saldo": async () => {
        const addSaldo = await useQuestion('Quanto de saldo voce deseja adicionar? ')
        await axios.post('http://localhost:3001/alterar-informacoes', {
            addSaldo: addSaldo,
            login: login
        })
        .then((res) => {
            console.table(res.data)
        })
    },
    "Voltar": () => {
        menuAtual = menuSteam
    }
}

const menuDesenvolvedor = {
    "Listar quantidade de vendas de jogos do gênero:": async () => {
        const genero = await useQuestion('Qual é o gênero do jogo?')

        await axios.post('http://localhost:3001/vendas-genero', {
            genero: genero
        }).then((res) => {
            console.table(res.data)
        })

        const placeHolder = await useQuestion('\nDigite algo para voltar')

    },
    "Listar usuário que nao se interessam por jogos do gênero:": async () => {
        const genero = await useQuestion('Qual é o gênero do jogo?')

        await axios.post('http://localhost:3001/desinteresse-genero', {
            genero: genero
        }).then((res) => {
            console.table(res.data)
        })

        const placeHolder = await useQuestion('\nDigite algo para voltar')

    },
    "Listar usuários fanáticos pelo estúdio:": async () => {
        const estudio = await useQuestion('Qual é o estúdio do jogo?')

        await axios.post('http://localhost:3001/fa-estudio', {
            estudio: estudio
        }).then((res) => {
            if(res.data.length != 0){
                console.table(res.data)
            } else {
                console.log('\nNenhum usuário possui todos os jogos dessa desenvolvedora.')
            }
        })

        const placeHolder = await useQuestion('\nDigite algo para voltar')

    },
    "Voltar": async () => {
        menuAtual = menuSteam
    }
}

const menuLoja = {
    "Listar jogos": async () => {
        let listaJogos
        let jogoSelecionado
        let idSelecionado
        let estaCarrinho
        let estaBiblioteca
        await axios.post('http://localhost:3001/loja')
        .then((res) => {
            listaJogos = res.data
            console.table(listaJogos)
        })
        do{
            idSelecionado = await useQuestion('\nQual jogo você deseja adicionar ao carrinho? (ID): ')
            jogoSelecionado = Boolean(listaJogos.find(({ idjogo }) => idjogo == idSelecionado))
            if(!jogoSelecionado){
                console.log('\nID inválido.')
            }
        }while(!jogoSelecionado)
        
        await axios.post('http://localhost:3001/add-carrinho', {
            login: login,
            idJogo: idSelecionado
        })
        .then((res) => {
            if(res.data){
                console.log('\nEsse jogo já está na sua biblioteca ou carrinho')
            }
        })

    },
    "Listar jogos por nome: ": async () => {
        const nome = await useQuestion('Nome do jogo: ')
        
        await axios.post('http://localhost:3001/loja', {
            nome: nome
        })
        .then((res) => {
            console.table(res.data)
        })
        const idJogo = await useQuestion('Qual jogo você deseja adicionar ao carrinho? (ID): ')
    },
    "Listar jogos por genero: ": async () => {
        const genero = await useQuestion('Genero do jogo: ')
        
        await axios.post('http://localhost:3001/loja', {
            genero: genero
        })
        .then((res) => {
            console.table(res.data)
        })
        const idJogo = await useQuestion('Qual jogo você deseja adicionar ao carrinho? (ID): ')
    },
    "Listar jogos populares: ": async () => {
        const vendas = await useQuestion('Quantidade mínima de vendas: ')

        await axios.post('http://localhost:3001/loja/jogos-populares', {
            vendas: vendas
        })
        .then((res) => {
            console.table(res.data)
        })
        const idJogo = await useQuestion('Qual jogo você deseja adicionar ao carrinho? (ID): ')
    },
    "Voltar": () => {
        menuAtual = menuSteam
    }
}

const menuCarrinho = {
    "Comprar": async () => {
        /**
         * Retira saldo,
         * Remove do carrinho,
         * Adiciona na biblioteca,
         * Cria pedido
         */
        menuAtual = menuSteam
    },
    "Remover": async () => {
        let idSelecionado
        let jogoSelecionado

        do{
             idSelecionado = await useQuestion('Qual jogo você deseja remover do carrinho? (ID): ')
             jogoSelecionado = Boolean(listaCarrinho.find(({ idjogo }) => idjogo == idSelecionado))
            if(!jogoSelecionado){
                console.log('\nEsse jogo não está no seu carrinho.')
            }
        }while(!jogoSelecionado)

        await axios.post('http://localhost:3001/remove-carrinho', {
            login: login,
            idJogo: idSelecionado
        }).then((res) => {
            console.log(res.data)
        })

        menuAtual = menuSteam
    },
    "Sair": async () => {
        menuAtual = menuSteam
    }
}

let menuAtual = menuInicial

const main = async () => {
    console.clear()
    console.log('\nBem-vindo à Steam')

    while(!sair){
        if(login){
            //console.clear()
            console.log('\nUsuário logado: ' + login)
        }
        console.log('\nEscolha uma das opções: ')
        const opcoes = Object.keys(menuAtual)

        // Se NÃO for um desenvolvedor nao mostra o menu de dev
        const opcoesFiltradas = opcoes.filter(item => {
            if(!dev && item === 'Menu de Desenvolvedor'){
                return false
            }
            return true
        })

        opcoesFiltradas.forEach((item, index) => {
            console.log(`${index+1}: ${item}`)
        })
        const escolha = await useQuestion('\nDigite a sua escolha: ')
        const nomeAcao = opcoesFiltradas[escolha-1]
        const acao = menuAtual[nomeAcao]
        if(!acao){
            console.clear()
            console.log('\n** Opção não encontrada. **')
        } else {
            console.clear()
            await acao()
        }

    }
}

main()


