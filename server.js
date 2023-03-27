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

app.post("/perfil", (req, res) => {
    
    const { login } = req.body

    db.query('SELECT * FROM usuario WHERE login = $1',
    [login], (err, result) => {
        res.send(result.rows)
    })
})

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

    db.query(`select * from usuario
                     where not exists (select login from biblioteca
                     natural right join publicacao
                     where estudio ILIKE $1
                     and idjogo NOT IN (select idjogo from biblioteca
                                        where login = usuario.login))`,
    [estudio], (err, result) => {
        res.send(result.rows)
    })

})

app.post("/meus-pedidos", (req, res) => {

    const { login } = req.body

    db.query(`select idpedido, to_char(data, 'DD/MM/YYYY') as data, precototal from pedido where login = $1`,
    [login], (err, result) => {
        res.send(result.rows)
    })
})

app.post("/meus-pedidos/validacao", (req, res) => {
    const { login } = req.body
    const { idPedido } = req.body

    db.query(`select * from pedido where login = $1 and idpedido = $2`,
    [login, idPedido], (err, result) => {
        if(result.rows.length > 0){
            res.send(true)
        } else {
            res.send(false)
        }
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