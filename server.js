const db = require('./db/db')
const express = require("express")
const app = express()
const cors = require("cors")

db.connect()

app.use(cors())
app.use(express.json())

app.listen(3001, () => {
    console.log('*')
})

// Janela de login

app.post("/login", (req, res) => {
    const { email } = req.body
    const { senha } = req.body

    db.query('SELECT * FROM usuario WHERE email = $1 AND senha = $2',
    [email, senha], (err, result) => {
        if(result.rows.length === 1){
            db.query('SELECT * FROM desenvolvedor WHERE login = $1',
            [result.rows[0].login], (err1, result1) => {
                if(result1.rows.length === 1) {
                    res.send([result.rows, true])
                    console.log('desenvolvedor')
                } else {
                    res.send([result.rows, false])
                    console.log('usuario')
                }
            })
        } else {
            res.send([result.rows, false])
            console.log('Login invalido')
        }
        
    })
})

app.post("/registrar", (req, res) => {
    const { login } = req.body
    const { email } = req.body
    const { senha } = req.body

    db.query('SELECT * FROM usuario WHERE login = $1 OR email = $2',
    [login, email], (err, result) => {
        if(result.rows.length === 0){
            res.send(true)
            db.query(`INSERT INTO "usuario" ("login", "email", "senha", "saldo") VALUES ($1, $2, $3, $4)`,
            [login, email, senha, 0], (err, result) => {
                if(!err){
                    console.log(login + ' registrado!')
                } else {
                    console.log(err.message)
                }
            })
        } else {
            res.send(false)
        }
    })
})

// Perfil

app.post("/perfil", (req, res) => {
    const { login } = req.body

    db.query('SELECT * FROM usuario WHERE login = $1',
    [login], (err, result) => {
        res.send(result.rows)
    })
})

app.post("/alterar-informacoes", (req, res) => {
    const { login } = req.body
    const { novoApelido } = req.body
    const { novoNome } = req.body
    const { novoPais } = req.body
    const { addSaldo } = req.body

    if(novoApelido){
        db.query(`update usuario set apelido = $1 where login = $2`,
        [novoApelido, login], (err, result) => {
            res.send('\nApelido alterado!')
        })
    } else if(novoNome) {
        db.query(`update usuario set nome = $1 where login = $2`,
        [novoNome, login], (err, result) => {
            res.send('\nNome alterado!')
        })
    } else if(novoPais) {
        db.query(`update usuario set pais = $1 where login = $2`,
        [novoPais, login], (err, result) => {
            res.send('\nPaís alterado!')
        })
    } else if(addSaldo){
        db.query(`update usuario set saldo = saldo + $1 where login = $2`,
        [addSaldo, login], (err, result) => {
            res.send('\nSaldo adicionado!')
        })
    }

})

// Loja

app.post("/loja", (req, res) => {
    const { nome } = req.body
    const { genero } = req.body

    if(nome){
        db.query(`SELECT idjogo, jogos.nome, preco, to_char(datalancamento, 'DD/MM/YYYY'), idademinima FROM jogos WHERE nome ILIKE $1`,
        ['%'+nome+'%'], (err, result) => {
            res.send(result.rows)
        })
    } else if(genero){
        db.query(`SELECT idjogo, jogos.nome, preco, to_char(datalancamento, 'DD/MM/YYYY'), idademinima FROM jogos natural join classificacao join genero using(idgenero) WHERE genero.nome ILIKE $1`,
        ['%'+genero+'%'], (err, result) => {
            res.send(result.rows)
        })
    } else {
        db.query(`SELECT idjogo, jogos.nome, preco, to_char(datalancamento, 'DD/MM/YYYY'), idademinima FROM jogos`, 
        (err, result) => {
            res.send(result.rows)
        })
    }
})

app.post("/loja/jogos-populares", (req, res) => {
    const { vendas } = req.body

    db.query(`select jogos.idjogo, publicacao.estudio Estudio, jogos.nome Jogo from publicacao
    natural join jogos
    where jogos.idjogo in (select idjogo from publicacao 
                            natural join biblioteca
                            group by idjogo
                            having count(idjogo) >= $1 )`,
    [vendas], (err, result) => {
        res.send(result.rows)
    })

})

app.post("/add-carrinho-validacao", (req, res) => {
    const { login } = req.body
    const { idJogo } = req.body

    db.query(`select * from biblioteca where login = $1 and idJogo = $2`, 
    [login, idJogo], (err, result) => {
        if(result.rows.length === 0){
            res.send(false)
        } else {
            res.send(true)
        }
    })
})

app.post("/add-carrinho", (req, res) => {
    const { login } = req.body
    const { idJogo } = req.body

    db.query(`insert into carrinho values($1, $2)`,
    [login, idJogo], (err, result) => {
        res.send(err)
    })
})

// Carrinho

app.post("/remove-carrinho", (req, res) => {
    const { login } = req.body
    const { idJogo } = req.body

    db.query(`delete from carrinho where login = $1 and idJogo = $2`, 
    [login, idJogo], (err, result) => {
        res.send('\n** Jogo removido do carrinho! **')
    })
})

app.post("/listar-carrinho", (req, res) => {
    const { login } = req.body

    db.query(`select idJogo, nome, preco from carrinho natural join jogos where login = $1`,
    [login], (err, result) => {
        res.send(result.rows)
    })
})

app.post("/get-saldo", (req, res) => {
    const { login } = req.body
    
    db.query('select saldo from usuario where login = $1', 
    [login], (err, result) => {
        res.send(result.rows)
    })

})

app.post("/cria-pedido", (req, res) => {
    const { precoTotal } = req.body
    const { login } = req.body
    const { idJogos } = req.body
    let idPedido
    
    // Cria o pedido
    db.query(`insert into pedido values( nextval('pedido_seq'), $1, current_timestamp, $2 )`, [precoTotal, login])

    // Atualiza o saldo
    db.query(`update usuario set saldo = saldo - $1 where login = $2`, [precoTotal, login])

    //Limpa o carrinho
    db.query(`delete from carrinho where login = $1`, [login])

    // Pega o id pedido gerado
    db.query(`select last_value from pedido_seq`, (err, result) => {
        idPedido = result.rows[0].last_value
    
        idJogos.forEach((id) => {
            console.log('tabela conteudo | idpedido: ' + idPedido, 'idjogo: ', id)
            // Cria uma relação entre idPedido e idJogo
            db.query(`insert into conteudo values( $1, $2 )`, [id, idPedido])
    
            // Atualiza biblioteca
            db.query(`insert into biblioteca values ( $1, $2, $3 )`, [login, id, 0])
        })
    })

    res.send('\n** Pedido finalizado! **')
})

// Menu Dev

app.post("/vendas-genero", (req, res) => {
    const { genero } = req.body

    db.query(`select jogos.nome as Jogo, count(biblioteca.login) as Vendas from jogos
                natural join biblioteca
                natural join classificacao
                join genero using (idGenero)
                where genero.nome ILIKE $1
                group by jogos.nome
                order by jogos.nome`,
                [genero], (err, result) => {
                    res.send(result.rows)
                })
})

app.post("/desinteresse-genero", (req, res) => {
    const { genero } = req.body

    db.query(`select distinct usuario.login, usuario.apelido, usuario.nome from usuario
    natural left join biblioteca
    left join classificacao using(idjogo)
    left join genero using(idgenero)
    where usuario.login not in (select distinct usuario.login from usuario
                                natural join biblioteca
                                join classificacao using(idjogo)
                                join genero using(idgenero)
                                  where genero.nome ILIKE $1)`,
                                  [genero], (err, result) => {
                                    res.send(result.rows)
                                  })
})

app.post("/fa-estudio", (req, res) => {
    const { estudio } = req.body

    db.query(`select login, email, apelido, nome from usuario
                     where not exists (select login from biblioteca
                     natural right join publicacao
                     where estudio ILIKE $1
                     and idjogo NOT IN (select idjogo from biblioteca
                                        where login = usuario.login))`,
    [estudio], (err, result) => {
        res.send(result.rows)
    })
})

app.post("/valor-inventario", (req, res) => {
    const { valor } = req.body

    db.query(`select usuario.login, sum(item.preco) as valorTotal from usuario
    natural join inventario
    join item using (idItem)
    group by usuario.login
    having sum(item.preco) >= $1`,
    [valor], (err, result) => {
        res.send(result.rows)
    })
})

app.get("/jogo-tempo-total", (req, res) => {
    
    db.query(`select jogos.nome, sum(horasjogadas) as tempoGlobal from biblioteca
    natural right join jogos
    group by jogos.nome
    order by tempoGlobal`, 
    (err, result) => {
        res.send(result.rows)
    })

})

app.get("/jogo-impopular", (req, res) => {
    
    db.query(`select * from jogos
    where idjogo not in (select idjogo from biblioteca)`, 
    (err, result) => {
        res.send(result.rows)
    })

})

// Biblioteca

app.post("/minha-biblioteca", (req, res) => {
    const { login } = req.body

    db.query(`select idJogo, nome, horasjogadas from biblioteca natural join jogos where login = $1`,
    [login], (err, result) => {
        res.send(result.rows)
    })

})

app.post("/jogar", (req, res) => {
    const { login } = req.body
    const { idJogo } = req.body
    const { horasJogadas } = req.body

    db.query(`update biblioteca 
                set horasJogadas = horasJogadas + $1 
                where login = $2 and idJogo = $3`,
    [horasJogadas, login, idJogo], (err, result) => {
        res.send(`\n** Você jogou o jogo ${idJogo} por ${horasJogadas} horas! **`)
    })

})

// Inventario

app.post("/get-inventario", (req, res) => {
    const { login } = req.body

    db.query(`select iditem, item.nome, count(iditem) as quantidade, min(preco) as valor_recomendado from inventario
            natural join item
            join usuario using (login)
            where usuario.login = $1
            group by iditem, item.nome
            order by item.nome`,
    [login], (err, result) => {
        res.send(result.rows)
    })
})

app.post("/cria-anuncio", (req, res) => {
    const { login } = req.body
    const { valor } = req.body
    const { infoItem } = req.body

    db.query(`insert into mercado values ( nextval('anuncio_seq'), $1, $2, $3 )`, [infoItem.iditem, login, valor])

    res.send(`\n** Você criou um anuncio para o item [${infoItem.nome}] no valor de [${valor}] **`)
})

// Mercado da Comunidade

app.get("/mercado-comunidade", (req, res) => {

    db.query(`select jogo_do_item, iditem, nome_item, count(nome_item) as quantidade, min(preco_anuncio) as menor_preco_disponivel from mercado_item_jogo
    group by nome_item, jogo_do_item, iditem
    order by jogo_do_item, nome_item`,
    (err, result) => {
        res.send(result.rows)
    })
})

app.post("/compra-mercado", (req, res) => {
    const { comprador } = req.body
    const { anunciante } = req.body
    const { valor } = req.body
    const { idAnuncio } = req.body
    const { idItem } = req.body

    // Atualiza saldo do comprador
    db.query(`update usuario set saldo = saldo - $1 where login = $2`, [valor, comprador])
    
    // Atualiza saldo do anunciante
    db.query(`update usuario set saldo = saldo + $1 where login = $2`, [valor, anunciante])
    
    // adiciona item ao inventario do comprador
    db.query(`insert into inventario values ( $1, $2 )`, [comprador, idItem])
    
    // remove item do inventario do anunciante
    //db.query(`delete from inventario where login = $1 and iditem = $2`, [anunciante, idItem])
    // Já é retirado no momento da criacao do anuncio 'gatilho'
    
    // remove anuncio
    db.query(`delete from mercado where login = $1 and idanuncio = $2`, [anunciante, idAnuncio])

    res.send('** Transação concluida! **')

})

app.post("/mercado-comunidade/item", (req, res) => {
    const { idItem } = req.body
    
    // Listagem de itens selecionados
    db.query(`select iditem, jogo_do_item, nome_item, descricao, idanuncio, anunciante, preco_anuncio from mercado_item_jogo
            where iditem = $1`, 
    [idItem], (err, result) => {
        res.send(result.rows)
    })
})

// Discussões

app.get("/get-discussoes", (req, res) => {
    db.query(`select * from discussoes order by idpostagem`,
    (err, result) => {
        res.send(result.rows)
    })
})

app.post("/get-comentarios", (req, res) => {
    const { idPostagem } = req.body

    db.query(`select * from comentario where idpostagem = $1`, 
    [idPostagem], (err, result) => {
        res.send(result.rows)
    })
})

app.post("/add-comentario", (req, res) => {
    const { idPostagem } = req.body
    const { login } = req.body
    const { comentario } = req.body

    db.query(`insert into comentario values ( nextval('comentario_seq'), $1, $2, $3 )`, 
    [idPostagem, login, comentario], () => {
        res.send('\n** Comentário publicado! **')
    })
})

app.post("/get-discussoes/meus-jogos", (req, res) => {
    const { login } = req.body

    db.query(`select idpostagem, titulo, mensagem, comentario from discussoes
    left join comentario using (idpostagem)
    where discussoes.idjogo IN (select idjogo from usuario
                                natural join biblioteca
                                where usuario.login = $1)`,
    [login], (err, result) => {
        res.send(result.rows)
    })
})

app.post("/add-discussao", (req, res) => {
    const { login } = req.body
    const { titulo } = req.body
    const { descricao } = req.body

    db.query(`insert into discussoes values ( nextval('discussao_seq'), $1, $2, $3 )`,
    [titulo, descricao, login], (err, result) => {
        res.send('\n** Tópico criado! **')
    })
    // 
})

// Historico de compras

app.post("/meus-pedidos", (req, res) => {
    const { login } = req.body

    db.query(`select idpedido, to_char(data, 'DD/MM/YYYY') as data, precototal from pedido where login = $1`,
    [login], (err, result) => {
        res.send(result.rows)
    })
})

app.post("/meus-pedidos/conteudo", (req, res) => {
    const { idPedido } = req.body

    db.query(`select idpedido, jogos.nome, jogos.preco from pedido_conteudo
                join jogos using (idjogo)
                join usuario using (login)
                where idpedido = $1`,
    [idPedido], (err, result) => {
        res.send(result.rows)
    })
})

app.post("/add-dev", (req, res) => {
    const { login } = req.body
    const { estudio } = req.body
    const { cpf } = req.body

    db.query(`insert into desenvolvedor values ( $1, $2, $3 )`, [login, estudio, cpf],
    (err, result) => {
        console.log(err)
        if(!err){
            res.send(true)
        } else {
            res.send(false)
        }
        
    })
})

// Publicar jogo

app.post("/publicar-jogo", (req, res) => {
    const { nomeJogo } = req.body
    const { valor } = req.body
    const { idadeMinima } = req.body
    const { login } = req.body
    const { generos } = req.body
    let idJogo
    let estudio

    // Criar o jogo
    db.query(`insert into jogos values ( nextval('jogo_seq'), $1, $2, current_timestamp, $3 )`, [nomeJogo, valor, idadeMinima])

    db.query(`select last_value from jogo_seq`,
    (err, result) => {
        idJogo = result.rows[0].last_value

        // Criar classificacao com os generos
        generos.forEach((idGenero) => {
            db.query(`insert into classificacao values ( $1, $2 )`, [idJogo, idGenero])
        })

    })

    // Criar publicacao
    db.query(`select nomeestudio from desenvolvedor where login = $1`, 
    [login], (err, result) => {
        estudio = result.rows[0].nomeestudio

        db.query(`insert into publicacao values ( $1, $2 )`, [estudio, idJogo])
    })

    res.send('\n** Jogo publicado! **')

})

app.get("/publicar-jogo/genero", (req, res) => {
    db.query(`select * from genero`,
    (err, result) => {
        res.send(result.rows)
    })
})