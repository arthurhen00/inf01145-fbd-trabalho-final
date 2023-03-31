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
                console.log('\n** Carrinho vazio! **')
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
        let listaBiblioteca
        let idSelecionado
        let jogoSelecionado
        console.log('Meus jogos:')
        await axios.post('http://localhost:3001/minha-biblioteca', {
            login:login
        })
        .then((res) => {
            if(res.data.length > 0){
                listaBiblioteca = res.data
                console.table(listaBiblioteca)
            } else {
                console.log('\n** Sua biblioteca está vazia! **')
            }
        })

        do{
            idSelecionado = await useQuestion('\nQual jogo você deseja jogar? (ID)')
            jogoSelecionado = Boolean(listaBiblioteca.find(({ idjogo }) => idjogo == idSelecionado))
            if(!jogoSelecionado){
                console.log('\nVocê nao possui esse jogo.')
            }
        }while(!jogoSelecionado)

        const horasJogadas = await useQuestion('\nJogar por quantas horas?')

        await axios.post('http://localhost:3001/jogar', {
            login: login,
            idJogo: idSelecionado,
            horasJogadas: horasJogadas
        })
        .then((res) => {
            console.clear()
            console.log(res.data)
        })

    },
    "Meu inventário": async () => {
        /**
         * Listar meu inventario
         * Deseja anunciar um item (Y/N)
         * selecione o ID do item
         * Gatilho aqui
         * atualiza o mercado -> remove do inventario
         */
        let idSelecionado
        let listaInventario
        let itemSelecionado
        let infoItem
        await axios.post('http://localhost:3001/get-inventario', {
            login: login
        })
        .then( async (res) => {
            if(res.data.length > 0){
                console.log('\nSeu inventário:')
                listaInventario = res.data
                console.table(listaInventario)
                
                const placeHolder = await useQuestion('\nDeseja anunciar um item? (Y/N)')
                if(placeHolder.toUpperCase() === 'Y'){
                    do{
                        idSelecionado = await useQuestion('\nSelecione o item: (ID)')
                        itemSelecionado = Boolean(listaInventario.find(({ iditem }) => iditem == idSelecionado))
                        infoItem = listaInventario.find(({ iditem }) => iditem == idSelecionado)
                        if(!itemSelecionado){
                            console.log('\n** Você nao possui esse item! **.')
                        }
                    }while(!itemSelecionado)

                    const precoAnuncio = await useQuestion(`\nAdicione um valor para o item [${infoItem.nome}] | Valor sugerido: [${infoItem.valor_recomendado}] reais`)

                    await axios.post('http://localhost:3001/cria-anuncio', {
                        login: login,
                        valor: precoAnuncio,
                        infoItem: infoItem
                    })
                    .then((res) => {
                        console.clear()
                        console.log(res.data)
                    })

                } else {
                    console.clear()
                }
            } else {
                console.log('\n** Invetário vazio **')
            }
        })
    },
    "Mercado da comunidade": async () => {
        let idSelecionado
        let itemSelecionado
        let listaMercado
        let listaItens
        let saldo
        let precoAnuncio
        let anunciante
        await axios.get('http://localhost:3001/mercado-comunidade')
        .then((res) => {
            listaMercado = res.data
            console.table(listaMercado)
        })

        const placeHolder = await useQuestion('\nDeseja comprar um item? (Y/N)')
        if(placeHolder.toUpperCase() === 'Y'){
            do{
                idSelecionado = await useQuestion('\nSelecione o item: (ID)')
                itemSelecionado = Boolean(listaMercado.find(({ iditem }) => iditem == idSelecionado))
                if(!itemSelecionado){
                    console.log('\n** Esse item nao está anunciado no mercado! **.')
                }
            }while(!itemSelecionado)

            await axios.post('http://localhost:3001/mercado-comunidade/item', {
                idItem: idSelecionado
            })
            .then((res) => {
                console.clear()
                listaItens = res.data
                console.log(`\nJogo: [${listaItens[0].jogo_do_item}]\nItem: [${listaItens[0].nome_item}]\nID item: [${listaItens[0].iditem}]`)
                console.log('Descrição: ' + listaItens[0].descricao + '\n')

                console.table(listaItens, ['idanuncio', 'anunciante', 'preco_anuncio'])
            })

            do{
                idSelecionado = await useQuestion('\nSelecione qual anuncio você deseja comprar: (ID)')
                itemSelecionado = Boolean(listaItens.find(({ idanuncio }) => idanuncio == idSelecionado))
                if(!itemSelecionado){
                    console.log('\n** Não existe esse anúncio! **.')
                } else {
                    precoAnuncio = listaItens.find(({ idanuncio }) => idanuncio == idSelecionado).preco_anuncio
                    anunciante = listaItens.find(({ idanuncio }) => idanuncio == idSelecionado).anunciante
                }
            }while(!itemSelecionado)

            // verificar saldo
            await axios.post('http://localhost:3001/get-saldo', {
                login: login
            })
            .then((res) => {
                saldo = res.data[0].saldo
            })

            console.clear()

            if(precoAnuncio > saldo) {
                console.log(`** Você nao possui saldo para comprar esse anúncio | Saldo: ${saldo} | Preço anúncio: ${precoAnuncio} | **`)
            } else {
                await axios.post('http://localhost:3001/compra-mercado', {
                    comprador: login,
                    anunciante: anunciante,
                    valor: precoAnuncio,
                    idAnuncio: idSelecionado,
                    idItem: listaItens[0].iditem
                })
                .then((res) => {
                    console.log(res.data)
                })
            }
        } else {
            console.clear()
        }
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
        })

        if(listaPedido.length > 0){
            console.table(listaPedido)
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
    
            const placeHolder = await useQuestion('\nEnter para voltar')
            console.clear()
        } else {
            console.log('** Você não possui um histórico de compras! **')
        }

    },
    "Discussões": async () => {
        // Lista TODAS as discussoes
        // * Listar discussoes sobre meus jogos
        // * Criar discussao
        let listaDiscussoes
        let idSelecionado
        let postSelecionado
        let postInfos
        await axios.get('http://localhost:3001/get-discussoes')
        .then((res) => {
            listaDiscussoes = res.data
            console.table(listaDiscussoes, ['idpostagem', 'titulo']) // idPostagem, login, idJogo, titulo, mensagem
        })

        const placeHolder = await useQuestion('\nDeseja entra em algum tópico? (Y/N)')
        if(placeHolder.toUpperCase() === 'Y'){
            do{
                idSelecionado = await useQuestion('\nQual tópico você deseja acessar? (ID): ')
                postSelecionado = Boolean(listaDiscussoes.find(({ idpostagem }) => idpostagem == idSelecionado))
                postInfos = listaDiscussoes.find(({ idpostagem }) => idpostagem == idSelecionado)
                if(!postSelecionado){
                    console.log('\n** ID inválido. **')
                }
            }while(!postSelecionado)

            // Listar postagem com os comentarios
            // Titulo (ID)
            // Mensagem
            // user: comentario
            console.clear()
            console.log(`Autor: ${postInfos.login}`)
            console.log(`Título: ${postInfos.titulo} [${postInfos.idpostagem}]`)
            console.log(`Mensagem: ${postInfos.mensagem}\n`)

            await axios.post('http://localhost:3001/get-comentarios',{
                idPostagem: idSelecionado
            })
            .then((res) => {
                if(res.data.length > 0){
                    res.data.forEach((item) => {
                        console.log(`${item.login}: ${item.comentario}`)
                    })
                } else {
                    console.log('Ainda não há comentários para esse tópico!')
                }
            })

            // Deseja adicionar um comentario?
            const placeHolder = await useQuestion('\nDeseja adicionar um comentário nesse tópico? (Y/N)')
            if(placeHolder.toUpperCase() === 'Y'){
                const comentario = await useQuestion('\nEscreva seu comentário:')

                await axios.post('http://localhost:3001/add-comentario', {
                    comentario: comentario,
                    login: login,
                    idPostagem: idSelecionado
                })
                .then((res) => {
                    console.clear()
                    console.log(res.data)
                })
            } else {
                console.clear()
            }
        } else {
            // menus
            menuAtual = menuDiscussoes
        }
        //const voltar = await useQuestion('\nEnter para voltar')
        //console.clear()
    },
    "Virar desenvolvedor": async () => {

    },
    "Menu de desenvolvedor": async () => {
        menuAtual = menuDesenvolvedor
    },
    "Publicar jogo": async () => {
        
    },
    "Sair": async () => {
        login = null
        dev = false
        listaCarrinho = null
        menuAtual = menuInicial
    }
}

const menuDiscussoes = {
    "Listar discussões dos meus jogos": async () => {
        await axios.post('http://localhost:3001/get-discussoes/meus-jogos', {
            login: login
        })
        .then((res) => {
            console.table(res.data, ['idpostagem', 'titulo'])
        })
    },
    "Criar uma discussão": async () => {
        const titulo = await useQuestion('\nTítulo da sua discussão:')
        const descricao = await useQuestion('\nDescrição da sua discussão:')

        await axios.post('http://localhost:3001/add-discussao', {
            login: login,
            titulo: titulo,
            descricao: descricao
        })
        .then((res) => {
            console.clear()
            console.log(res.data)
        })

    },
    "Voltar": async () => {
        menuAtual = menuSteam
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
            console.log(res.data)
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
                console.log('\n** ID inválido. **')
            }
        }while(!jogoSelecionado)
        
        await axios.post('http://localhost:3001/add-carrinho-validacao', {
            login: login,
            idJogo: idSelecionado
        })
        .then((res) => {
            estaBiblioteca = res.data
        })

        console.clear()

        if(!estaBiblioteca){
            await axios.post('http://localhost:3001/add-carrinho', {
                login: login,
                idJogo: idSelecionado
            })
            .then((res) => {
                if(res.data){
                    console.log('\n** Esse jogo já está no seu carrinho **')
                } else {
                    console.log('\n** Jogo adicionado ao carrinho! **')
                }
            })
        } else {
            console.log("\n** Esse jogo já está na sua biblioteca! **")
        }

    },
    "Listar jogos por nome: ": async () => {
        let listaJogos
        let jogoSelecionado
        let idSelecionado
        let estaCarrinho
        let estaBiblioteca
        const nome = await useQuestion('Nome do jogo: ')
        
        await axios.post('http://localhost:3001/loja', {
            nome: nome
        })
        .then((res) => {
            listaJogos = res.data
            console.table(listaJogos)
        })
        
        if(listaJogos.length > 0){
            do{
                idSelecionado = await useQuestion('\nQual jogo você deseja adicionar ao carrinho? (ID): ')
                jogoSelecionado = Boolean(listaJogos.find(({ idjogo }) => idjogo == idSelecionado))
                if(!jogoSelecionado){
                    console.log('\nID inválido.')
                }
            }while(!jogoSelecionado)
            
            await axios.post('http://localhost:3001/add-carrinho-validacao', {
                login: login,
                idJogo: idSelecionado
            })
            .then((res) => {
                estaBiblioteca = res.data
            })
    
            console.clear()
    
            if(!estaBiblioteca){
                await axios.post('http://localhost:3001/add-carrinho', {
                    login: login,
                    idJogo: idSelecionado
                })
                .then((res) => {
                    if(res.data){
                        console.log('\n** Esse jogo já está no seu carrinho **')
                    } else {
                        console.log('\n** Jogo adicionado ao carrinho! **')
                    }
                })
            } else {
                console.log("\n** Esse jogo já está na sua biblioteca! **")
            }
        } else {
            console.clear()
            console.log('\n** Nenhum jogo com esse nome encontrado! **');
        }

    },
    "Listar jogos por genero: ": async () => {
        let listaJogos
        let jogoSelecionado
        let idSelecionado
        let estaCarrinho
        let estaBiblioteca
        const genero = await useQuestion('Genero do jogo: ')
        
        await axios.post('http://localhost:3001/loja', {
            genero: genero
        })
        .then((res) => {
            listaJogos = res.data
            console.table(listaJogos)
        })
        
        if(listaJogos.length > 0){
            do{
                idSelecionado = await useQuestion('\nQual jogo você deseja adicionar ao carrinho? (ID): ')
                jogoSelecionado = Boolean(listaJogos.find(({ idjogo }) => idjogo == idSelecionado))
                if(!jogoSelecionado){
                    console.log('\nID inválido.')
                }
            }while(!jogoSelecionado)
            
            await axios.post('http://localhost:3001/add-carrinho-validacao', {
                login: login,
                idJogo: idSelecionado
            })
            .then((res) => {
                estaBiblioteca = res.data
            })
    
            console.clear()
    
            if(!estaBiblioteca){
                await axios.post('http://localhost:3001/add-carrinho', {
                    login: login,
                    idJogo: idSelecionado
                })
                .then((res) => {
                    if(res.data){
                        console.log('\n** Esse jogo já está no seu carrinho **')
                    } else {
                        console.log('\n** Jogo adicionado ao carrinho! **')
                    }
                })
            } else {
                console.log("\n** Esse jogo já está na sua biblioteca! **")
            }
        } else {
            console.clear()
            console.log('\n** Nenhum jogo com esse gênero encontrado! **');
        }

    },
    "Listar jogos populares: ": async () => {
        let listaJogos
        let jogoSelecionado
        let idSelecionado
        let estaCarrinho
        let estaBiblioteca
        const vendas = await useQuestion('Quantidade mínima de vendas: ')

        await axios.post('http://localhost:3001/loja/jogos-populares', {
            vendas: vendas
        })
        .then((res) => {
            listaJogos = res.data
            console.table(listaJogos)
        })
        
        if(listaJogos.length > 0){
            do{
                idSelecionado = await useQuestion('\nQual jogo você deseja adicionar ao carrinho? (ID): ')
                jogoSelecionado = Boolean(listaJogos.find(({ idjogo }) => idjogo == idSelecionado))
                if(!jogoSelecionado){
                    console.log('\nID inválido.')
                }
            }while(!jogoSelecionado)
            
            await axios.post('http://localhost:3001/add-carrinho-validacao', {
                login: login,
                idJogo: idSelecionado
            })
            .then((res) => {
                estaBiblioteca = res.data
            })
    
            console.clear()
    
            if(!estaBiblioteca){
                await axios.post('http://localhost:3001/add-carrinho', {
                    login: login,
                    idJogo: idSelecionado
                })
                .then((res) => {
                    if(res.data){
                        console.log('\n** Esse jogo já está no seu carrinho **')
                    } else {
                        console.log('\n** Jogo adicionado ao carrinho! **')
                    }
                })
            } else {
                console.log("\n** Esse jogo já está na sua biblioteca! **")
            }
        } else {
            console.clear()
            console.log('\n** Nenhum com essa quantidade de vendas encontrado! **');
        }

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
        let saldo
        let carrinhoVazio
        await axios.post('http://localhost:3001/get-saldo', {
            login: login
        })
        .then((res) => {
            saldo = res.data[0].saldo
        })

        await axios.post('http://localhost:3001/listar-carrinho', {
            login: login
        })
        .then((res) => {
            if(res.data.length > 0){
                listaCarrinho = res.data
            } else {
                carrinhoVazio = true
            }
        })

        let precoTotal = 0
        let idJogos = []
        listaCarrinho.forEach((item) => {
            precoTotal += item.preco
            idJogos.push(item.idjogo)
        })

        if(precoTotal > saldo) {
            console.log(`\n** Saldo insuficiente! Saldo disponível: ${saldo}; Total: ${precoTotal} **`)
        } else {
                
            await axios.post('http://localhost:3001/cria-pedido', {
                precoTotal: precoTotal,
                login: login,
                idJogos: idJogos
            })
            .then((res) => {
                console.log(res.data)
            })
        }

        

        menuAtual = menuSteam
    },
    "Remover": async () => {
        let idSelecionado
        let jogoSelecionado

        console.table(listaCarrinho)

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
            console.clear()
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
            if(!dev && (item === 'Menu de desenvolvedor' || item === 'Publicar jogo') || dev && item === 'Virar desenvolvedor'){
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