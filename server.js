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

app.post("/login", (req, res) => {

    const { email } = req.body
    const { senha } = req.body

    db.query('SELECT * FROM usuario WHERE email = $1 AND senha = $2',
    [email, senha], (err, result) => {
        if(err){
            console.log(err)
        } else {
            res.send(result)
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
        db.query('SELECT * FROM jogos WHERE nome ILIKE $1',
        ['%'+nome+'%'], (err, result) => {
            res.send(result.rows)
        })
    } else if(genero){
        db.query('SELECT idjogo, jogos.nome, preco, datalancamento, idademinima FROM jogos natural join classificacao join genero using(idgenero) WHERE genero.nome ILIKE $1',
        ['%'+genero+'%'], (err, result) => {
            res.send(result.rows)
        })
    } else {
        db.query('SELECT * FROM jogos', 
        (err, result) => {
            res.send(result.rows)
        })
    }
})

app.post("/add-carrinho", (req, res) => {

})