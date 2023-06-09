const db = require('./db')

async function createTabelas(){

    await db.connect()

    await db.query(`CREATE TABLE Usuario(
        login VARCHAR(30) UNIQUE PRIMARY KEY,
        email VARCHAR(60) UNIQUE NOT NULL,
        senha VARCHAR(30) NOT NULL,
        apelido VARCHAR(60),
        nome VARCHAR(60),
        pais VARCHAR(30),
        saldo FLOAT NOT NULL
    )`)

    await db.query(`CREATE TABLE Desenvolvedor(
        login VARCHAR(30),
        nomeEstudio VARCHAR(60) PRIMARY KEY,
        cpf CHAR(11) UNIQUE NOT NULL,
        FOREIGN KEY (login) REFERENCES Usuario(login) 
    )`)

    await db.query(`CREATE TABLE Jogos(
        idJogo SERIAL PRIMARY KEY,
        nome VARCHAR(60) UNIQUE NOT NULL,
        preco FLOAT NOT NULL,
        dataLancamento DATE NOT NULL,
        idadeMinima INT NOT NULL
    )`)

    await db.query(`CREATE TABLE Genero(
        idGenero SERIAL PRIMARY KEY,
        nome VARCHAR(60) UNIQUE NOT NULL
    )`)

    await db.query(`CREATE TABLE Classificacao(
        idJogo SERIAL NOT NULL,
        idGenero SERIAL NOT NULL,
        FOREIGN KEY (idJogo) REFERENCES Jogos(idJogo),
        FOREIGN KEY (idGenero) REFERENCES Genero(idGenero)
    )`)

    await db.query(`CREATE TABLE Publicacao(
        estudio VARCHAR(60) NOT NULL,
        idJogo SERIAL NOT NULL,
        FOREIGN KEY (estudio) REFERENCES Desenvolvedor(nomeEstudio),
        FOREIGN KEY (idJogo) REFERENCES Jogos(idJogo)
    )`)

    await db.query(`CREATE TABLE Pedido(
        idPedido SERIAL PRIMARY KEY,
        precoTotal FLOAT NOT NULL,
        data DATE NOT NULL,
        login VARCHAR(30) NOT NULL,
        FOREIGN KEY (login) REFERENCES Usuario(login)
    )`)

    await db.query(`CREATE TABLE Conteudo(
        idJogo SERIAL NOT NULL,
        idPedido SERIAL NOT NULL,
        FOREIGN KEY (idJogo) REFERENCES Jogos(idJogo),
        FOREIGN KEY (idPedido) REFERENCES Pedido(idPedido)
    )`)

    await db.query(`CREATE TABLE Biblioteca(
        login VARCHAR(30) NOT NULL,
        idJogo SERIAL NOT NULL,
        horasJogadas FLOAT NOT NULL,
        FOREIGN KEY (login) REFERENCES Usuario(login),
        FOREIGN KEY (idJogo) REFERENCES Jogos(idJogo),
        UNIQUE (idJogo, login)
    )`)

    await db.query(`CREATE TABLE Item(
        idItem SERIAL PRIMARY KEY,
        nome VARCHAR(120) NOT NULL,
        preco FLOAT NOT NULL,
        descricao VARCHAR(512),
        idJogo SERIAL NOT NULL,
        FOREIGN KEY (idJogo) REFERENCES Jogos(idJogo)
    )`)

    await db.query(`CREATE TABLE Inventario(
        login VARCHAR(30),
        idItem SERIAL NOT NULL,
        --idJogo INT NOT NULL,
        FOREIGN KEY (login) REFERENCES Usuario(login)
        --FOREIGN KEY (idJogo) REFERENCES Jogos(idJogo)
    )`)

    await db.query(`CREATE TABLE Mercado(
        idAnuncio SERIAL PRIMARY KEY,
        idItem SERIAL NOT NULL,
        login VARCHAR(30) NOT NULL,
        preco FLOAT NOT NULL,
        FOREIGN KEY (idItem) REFERENCES Item(idItem),
        FOREIGN KEY (login) REFERENCES Usuario(login)
    )`)

    await db.query(`CREATE TABLE Discussoes(
        idPostagem SERIAL PRIMARY KEY,
        titulo VARCHAR(60),
        mensagem VARCHAR(1200) NOT NULL,
        login VARCHAR(30) NOT NULL,
        idJogo SERIAL,
        FOREIGN KEY (login) REFERENCES Usuario(login),
        FOREIGN KEY (idJogo) REFERENCES Jogos(idJogo)
    )`)
    
    await db.query(`CREATE TABLE Comentario(
        idComentario SERIAL PRIMARY KEY,
        idPostagem SERIAL NOT NULL,
        login VARCHAR(30) NOT NULL,
        comentario VARCHAR(400) NOT NULL,
        FOREIGN KEY (idPostagem) REFERENCES discussoes(idPostagem),
        FOREIGN KEY (login) REFERENCES usuario(login)
    )`)

    await db.query(`CREATE TABLE Carrinho(
        login VARCHAR(30) NOT NULL,
        idJogo INT NOT NULL,
        UNIQUE (login, idJogo),
        FOREIGN KEY (login) REFERENCES usuario(login),
        FOREIGN KEY (idJogo) REFERENCES jogos(idjogo)
    )`)

    await db.query(`CREATE SEQUENCE pedido_seq START 15`)
    await db.query(`CREATE SEQUENCE anuncio_seq START 29`)
    await db.query(`CREATE SEQUENCE comentario_seq START 4`)
    await db.query(`CREATE SEQUENCE discussao_seq START 6`)
    await db.query(`CREATE SEQUENCE jogo_seq START 18`)

    console.log('Tabelas criadas.')
    await db.end()

}

createTabelas()