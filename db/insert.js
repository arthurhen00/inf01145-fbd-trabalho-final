const db = require('./server')

async function insertTabelas(){

    await db.connect()

    await db.query( `insert into Jogos VALUES (1, 'Dark Souls REMASTERED', 129.90, '2018-05-23', 18)` )
    await db.query( `insert into Jogos VALUES (2, 'Dark Souls II', 60.99, '2014-04-25', 18)` )
    await db.query( `insert into Jogos VALUES (3, 'Dark Souls II: Scholar of the First Sin', 79.99, '2015-04-01', 18)` )
    await db.query( `insert into Jogos VALUES (4, 'Dark Souls III', 159.90, '2016-04-11', 18)` )
    await db.query( `insert into Jogos VALUES (5, 'Need For Speed Payback', 89, '2017-09-06', 12)` )
    await db.query( `insert into Jogos VALUES (6, 'Battlefield 4', 199, '2013-10-29', 18)` )

    await db.query( `insert into Genero VALUES
        (1, 'Soulslike'),
        (2, 'Terror'),
        (3, 'Ação'),
        (4, 'Aventura'),
        (5, 'RPG'),
        (6, 'Corrida')
    ` )

    await db.query( `insert into Classificacao VALUES
        (1, 1),
        (1, 3),
        (1, 4),
        (2, 1),
        (2, 3),
        (2, 4),
        (3, 1),
        (3, 3),
        (3, 4),
        (4, 1),
        (4, 3),
        (4, 4),
        (5, 4),
        (5, 6),
        (6, 3)
    ` )

    await db.query( `insert into Usuario (login, email, senha, saldo) VALUES
        ('user', 'user@hotmail.com', 'user', 10)
    ` )

    await db.query( `insert into Usuario VALUES
        ('usuario1', 'usuario1@hotmail.com', '1234', 'user1', NULL, 'Brasil', 10),
        ('usuario2', 'usuario2@hotmail.com', '1234', 'user2', NULL, 'Belize', 20),
        ('usuario3', 'usuario3@hotmail.com', '1234', 'user3', NULL, 'Bolívia', 30),
        ('usuario4', 'usuario4@hotmail.com', '1234', 'user4', NULL, 'Bangladesh', 40),
        ('usuario5', 'usuario5@hotmail.com', '1234', 'user5', NULL, 'Bélgica', 50),
        ('usuario6', 'usuario6@hotmail.com', '1234', 'user6', NULL, 'China', 60),
        ('usuario7', 'usuario7@hotmail.com', '1234', 'user7', NULL, 'Índia', 70),
        ('usuario8', 'usuario8@hotmail.com', '1234', 'user8', NULL, 'Estados Unidos', 80),
        ('usuario9', 'usuario9@hotmail.com', '1234', 'user9', NULL, 'Paquistão', 90),
        ('usuario10', 'usuario10@hotmail.com', '1234', 'user10', NULL, 'Canada', 100)
    ` )

    await db.query( `insert into Desenvolvedor VALUES
        ('usuario1', 'FromSoftware', '12345678901'),
        ('usuario2', 'EA Games', '99999999999'),
        ('usuario3', 'Dice', '40028922123')
    ` )

    await db.query( `insert into Publicacao VALUES
        ('FromSoftware', 1),
        ('FromSoftware', 2),
        ('FromSoftware', 3),
        ('FromSoftware', 4),
        ('EA Games', 5),
        ('Dice', 6)
    ` )

    await db.query( `insert into Biblioteca VALUES
        ('usuario1', 1, 100),
        ('usuario1', 2, 39),
        ('usuario1', 3, 52),
        ('usuario1', 4, 321),
        ('usuario1', 5, 1),
        ('usuario1', 6, 2),
        ('usuario2', 6, 77),
        ('usuario2', 4, 6),
        ('usuario3', 1, 0),
        ('usuario3', 2, 0),
        ('usuario3', 3, 0)
    ` )

    await db.query( `insert into Pedido VALUES
        ('1', 726.88, '2021-09-12', 'usuario1'),
        ('2', 358.9, '2022-01-01', 'usuario2'),
        ('3', 270.88, '2023-12-25', 'usuario3')
    ` )

    await db.query( `insert into Conteudo VALUES
        (1, 1),
        (2, 1),
        (3, 1),
        (4, 1),
        (5, 1),
        (6, 1),
        (6, 2),
        (4, 2),
        (1, 3),
        (2, 3),
        (3, 3)
    ` )

    await db.query( `insert into Item VALUES
        (1, 'Cathedral of the Deep', 0.48, 'Steam-Carta Colecionável de DARK SOULS™ III-The Cathedral of the Deep', 4),
        (2, 'Lothric Castle', 0.5, 'Steam-Carta Colecionável de DARK SOULS™ III-Lothric Castle', 4),
        (3, 'Road of Sacrifices', 0.48, 'Steam-Carta Colecionável de DARK SOULS™ III-The Road of Sacrifices', 4),
        (4, 'Undead Settlement', 0.48, 'Steam-Carta Colecionável de DARK SOULS™ III-The Undead Settlement', 4)
    ` )
    
    await db.query( `insert into Inventario VALUES
        ('usuario1', 1),
        ('usuario1', 2),
        ('usuario1', 3),
        ('usuario1', 4),
        ('usuario1', 4),
        ('usuario3', 1),
        ('usuario3', 1)
    ` )

    await db.query( `insert into Mercado VALUES
        (1, 4, 'usuario1', 1),
        (2, 1, 'usuario3', 1.5)
    ` )

    await db.query( `insert into Discussoes VALUES
        (1, 'Como fazer a Fire Keeper falar', 'Todo vez que eu tento interagir com a fire keeper 
        de fire link ela não retorna respostas, alguém sabe o que fazer para ela falar?', 'usuario1', 1),
        (2, 'Corridas noturnas', 'a quantidade de policiais aumenta durante a noite?', 'usuario2', 5),
        (3, 'Modificação de armas', 'para subir o nivel da arma é necessario atingir uma quantidade de kills com ela', 'usuario3', 6),
        (4, 'Modificação de veiculos', 'basta dirigir com o veiculo que ele ira subir de nivel', 'usuario3', 6)
    ` )
    
    console.log('Valores inseridos.')
    await db.end()

}

insertTabelas()