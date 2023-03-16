const express = require("express")
const app = express()
const cors = require("cors")

const {Client} = require("pg")
const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "casadavovo",
    database: "postgres"
})
client.connect()

app.use(cors())
app.use(express.json())

app.listen(3001, () => {
    console.log('*')
})

app.post("/login", (req, res) => {

    const { email } = req.body
    const { senha } = req.body

    client.query('SELECT * FROM usuario WHERE email = $1 AND senha = $2',
    [email, senha], (err, result) => {
        if(err){
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.get("/loja", (req, res) => {
    client.query('SELECT * FROM jogos', 
    (err, result) => {
        res.send(result.rows)
    })
})