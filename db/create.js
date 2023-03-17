const db = require('./db')

async function createTabelas(){

    await db.connect()

    await db.query(`CREATE TABLE Usuario(
        login VARCHAR(30) UNIQUE PRIMARY KEY,
        email VARCHAR(60) UNIQUE NOT NULL,
        senha VARCHAR(30) NOT NULL,
        apelido VARCHAR(60),
        nome VARCHAR(60),
        país VARCHAR(30),
        saldo FLOAT NOT NULL
    )`)

    await db.query(`CREATE TABLE Desenvolvedor(
        login VARCHAR(30),
        nomeEstudio VARCHAR(60) PRIMARY KEY,
        cpf CHAR(11) UNIQUE NOT NULL,
        FOREIGN KEY (login) REFERENCES Usuario(login) 
    )`)

    await db.query(`CREATE TABLE Jogos(
        idJogo INT PRIMARY KEY,
        nome VARCHAR(60) UNIQUE NOT NULL,
        preco FLOAT NOT NULL,
        dataLancamento DATE NOT NULL,
        idadeMinima INT NOT NULL
    )`)

    await db.query(`CREATE TABLE Genero(
        idGenero INT PRIMARY KEY,
        nome VARCHAR(60) UNIQUE NOT NULL
    )`)

    await db.query(`CREATE TABLE Classificacao(
        idJogo INT NOT NULL,
        idGenero INT NOT NULL,
        FOREIGN KEY (idJogo) REFERENCES Jogos(idJogo),
        FOREIGN KEY (idGenero) REFERENCES Genero(idGenero)
    )`)

    await db.query(`CREATE TABLE Publicacao(
        estudio VARCHAR(60) NOT NULL,
        idJogo INT NOT NULL,
        FOREIGN KEY (estudio) REFERENCES Desenvolvedor(nomeEstudio),
        FOREIGN KEY (idJogo) REFERENCES Jogos(idJogo)
    )`)

    await db.query(`CREATE TABLE Pedido(
        idPedido INT PRIMARY KEY,
        precoTotal FLOAT NOT NULL,
        data DATE NOT NULL,
        usuario VARCHAR(30) NOT NULL,
        FOREIGN KEY (usuario) REFERENCES Usuario(login)
    )`)

    await db.query(`CREATE TABLE Conteudo(
        idJogo INT NOT NULL,
        idPedido INT NOT NULL,
        FOREIGN KEY (idJogo) REFERENCES Jogos(idJogo),
        FOREIGN KEY (idPedido) REFERENCES Pedido(idPedido)
    )`)

    await db.query(`CREATE TABLE Biblioteca(
        usuario VARCHAR(30) NOT NULL,
        idJogo INT NOT NULL,
        horasJogadas FLOAT NOT NULL,
        FOREIGN KEY (usuario) REFERENCES Usuario(login),
        FOREIGN KEY (idJogo) REFERENCES Jogos(idJogo),
        UNIQUE (idJogo, usuario)
    )`)

    await db.query(`CREATE TABLE Item(
        idItem INT PRIMARY KEY,
        nome VARCHAR(30) NOT NULL,
        preco FLOAT NOT NULL,
        descricao VARCHAR(256),
        idJogo INT NOT NULL,
        FOREIGN KEY (idJogo) REFERENCES Jogos(idJogo)
    )`)

    await db.query(`CREATE TABLE Inventario(
        usuario VARCHAR(30),
        idItem INT NOT NULL,
        --idJogo INT NOT NULL,
        FOREIGN KEY (usuario) REFERENCES Usuario(login)
        --FOREIGN KEY (idJogo) REFERENCES Jogos(idJogo)
    )`)

    await db.query(`CREATE TABLE Mercado(
        idAnuncio INT PRIMARY KEY,
        idItem INT NOT NULL,
        usuario VARCHAR(30) NOT NULL,
        preco FLOAT NOT NULL,
        FOREIGN KEY (idItem) REFERENCES Item(idItem),
        FOREIGN KEY (usuario) REFERENCES Usuario(login)
    )`)

    await db.query(`CREATE TABLE Discussoes(
        idPostagem INT PRIMARY KEY,
        titulo VARCHAR(60),
        mensagem VARCHAR(1200) NOT NULL,
        usuario VARCHAR(30) NOT NULL,
        idJogo INT,
        FOREIGN KEY (usuario) REFERENCES Usuario(login),
        FOREIGN KEY (idJogo) REFERENCES Jogos(idJogo)
    )`)
    

    console.log('Tabelas criadas.')
    await db.end()

}

createTabelas()