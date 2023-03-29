const db = require('./db')

async function insertTabelas(){

    await db.connect()

    await db.query(`CREATE VIEW mercado_item_jogo AS
    select mercado.login as anunciante,
           item,iditem,
           item.nome as nome_item, 
           jogos.nome as jogo_do_item, 
           mercado.preco as preco_anuncio, 
           item.preco as preco_item from mercado
    join item using (iditem)
    join jogos using (idjogo);
    `)

    await db.query(`CREATE VIEW pedido_conteudo AS
                    select idpedido, login, data, precototal, idjogo from pedido
                    natural join conteudo
                    order by idpedido;
    `)

    await db.query( `insert into Jogos VALUES (1, 'Dark Souls REMASTERED', 129.90, '2018-05-23', 18)` )
    await db.query( `insert into Jogos VALUES (2, 'Dark Souls II', 60.99, '2014-04-25', 18)` )
    await db.query( `insert into Jogos VALUES (3, 'Dark Souls II: Scholar of the First Sin', 79.99, '2015-04-01', 18)` )
    await db.query( `insert into Jogos VALUES (4, 'Dark Souls III', 159.90, '2016-04-11', 18)` )
    await db.query( `insert into Jogos VALUES (5, 'Need For Speed Payback', 89, '2017-09-06', 12)` )
    await db.query( `insert into Jogos VALUES (6, 'Battlefield 4', 199, '2013-10-29', 18)` )
    await db.query( `insert into Jogos VALUES (7, 'Sekiro™: Shadows Die Twice - GOTY Edition', 199.90, '2019-03-21', 18)` )
    await db.query( `insert into Jogos VALUES (8, 'ELDEN RING', 249.90, '2022-02-24', 18)` )

    await db.query(`insert into Jogos VALUES
        (9, 'FINAL FANTASY', 45.00, '2021-08-12', 18),
        (10, 'FINAL FANTASY 2', 45.00, '2021-06-28', 18),
        (11, 'FINAL FANTASY 3', 70.00, '2021-08-12', 18),
        (12, 'FINAL FANTASY 4', 70.00, '2021-09-08', 18),
        (13, 'FINAL FANTASY 5', 70.00, '2021-11-10', 18),
        (14, 'FINAL FANTASY 6', 70.00, '2022-02-23', 18),
        (15, 'FINAL FANTASY 7 REMAKE INTERGRADE', 349.99, '2022-07-17', 18),
        (16, 'Counter Strike Global Offensive', 0.00, '2012-07-21', 14),
        (17, 'Dota 2', 0.00, '2013-06-09', 8)
        `)

    await db.query( `insert into Genero VALUES
        (1, 'Soulslike'),
        (2, 'Terror'),
        (3, 'Ação'),
        (4, 'Aventura'),
        (5, 'RPG'),
        (6, 'Corrida'),
        (7, 'Mundo Aberto'),
        (8, 'Difícil'),
        (9, 'Um jogador'),
        (10, 'Multi jogador'),
        (11, 'JRPG'),
        (12, 'RPG de Grupos'),
        (13, 'FPS'),
        (14, 'Tático'),
        (15, 'Tiro'),
        (16, 'MOBA')
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
        (6, 3),
        (7, 1),
        (7, 3),
        (7, 8),
        (7, 9),
        (8, 1),
        (8, 3),
        (8, 5),
        (8, 7),
        (8, 8),
        (9, 11),
        (9, 5),
        (9, 12),
        (10, 11),
        (10, 5),
        (10, 12),
        (11, 11),
        (11, 5),
        (11, 12),
        (12, 11),
        (12, 5),
        (12, 12),
        (13, 11),
        (13, 5),
        (13, 12),
        (14, 11),
        (14, 5),
        (14, 12),
        (15, 11),
        (15, 5),
        (15, 12),
        (15, 3),
        (15, 4),
        (16, 13),
        (16, 14),
        (16, 15),
        (16, 10),
        (17, 10),
        (17, 16),
        (17, 14)
    ` )

    await db.query( `insert into Usuario (login, email, senha, saldo) VALUES
        ('user', 'user@hotmail.com', 'user', 10),
        ('FaFromSoftware', 'fa@hotmail.com', 'senha', 333)
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
        ('usuario10', 'usuario10@hotmail.com', '1234', 'user10', NULL, 'Canada', 100),
        ('square', 'square@gmail.com', '1234', 'dev square', NULL, 'Canada', 1000),
        ('gabe', 'gabe@gmail.com', '1234', 'just gabe', NULL, 'Estados Unidos', 130),
        ('storage', 'storage@gmail.com', '1234', 'maniaco do cs', NULL, 'Alemanha', 6323)
    ` )

    await db.query( `insert into Desenvolvedor VALUES
        ('usuario1', 'FromSoftware', '12345678901'),
        ('usuario2', 'EA Games', '99999999999'),
        ('usuario3', 'Dice', '40028922123'),
        ('square', 'Square Enix', '11111111111'),
        ('gabe', 'Valve', '22222222222')
    ` )

    await db.query( `insert into Publicacao VALUES
        ('FromSoftware', 1),
        ('FromSoftware', 2),
        ('FromSoftware', 3),
        ('FromSoftware', 4),
        ('FromSoftware', 7),
        ('FromSoftware', 8),
        ('EA Games', 5),
        ('Square Enix', 9),
        ('Square Enix', 10),
        ('Square Enix', 11),
        ('Square Enix', 12),
        ('Square Enix', 13),
        ('Square Enix', 14),
        ('Square Enix', 15),
        ('Valve', 16),
        ('Valve', 17)
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
        ('usuario3', 3, 0),
        ('usuario4', 1, 2),
        ('usuario5', 1, 3),
        ('usuario6', 1, 4),
        ('FaFromSoftware', 1, 100),
        ('FaFromSoftware', 2, 100),
        ('FaFromSoftware', 3, 100),
        ('FaFromSoftware', 4, 100),
        ('FaFromSoftware', 7, 100),
        ('FaFromSoftware', 8, 100),
        ('FaFromSoftware', 6, 0),
        ('storage', 16, 9999),
        ('usuario1', 16, 0),
        ('usuario2', 16, 0),
        ('usuario3', 16, 0),
        ('usuario4', 16, 0),
        ('usuario5', 16, 0),
        ('usuario6', 16, 0)
    ` )

    await db.query( `insert into Pedido VALUES
        (1, 726.88, '2021-09-12', 'usuario1'),
        (2, 358.9, '2022-01-01', 'usuario2'),
        (3, 270.88, '2023-12-25', 'usuario3'),
        (4, 129.90, '2023-12-25', 'usuario4'),
        (5, 129.90, '2023-12-25', 'usuario5'),
        (6, 129.90, '2023-12-25', 'usuario6'),
        (7, 880.58, '2023-12-25', 'FaFromSoftware'),
        (8, 0, '2013-12-25', 'storage'),
        (9, 0, '2020-12-25', 'usuario1'),
        (10, 0, '2020-12-25', 'usuario2'),
        (11, 0, '2020-12-25', 'usuario3'),
        (12, 0, '2020-12-25', 'usuario4'),
        (13, 0, '2020-12-25', 'usuario5'),
        (14, 0, '2020-12-25', 'usuario6')
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
        (3, 3),
        (1, 4),
        (1, 5),
        (1, 6),
        (1, 7),
        (2, 7),
        (3, 7),
        (4, 7),
        (7, 7),
        (8, 7),
        (16, 8),
        (16, 9),
        (16, 10),
        (16, 11),
        (16, 12),
        (16, 13),
        (16, 14)
    ` )

    await db.query( `insert into Item VALUES
        (1, 'Cathedral of the Deep', 0.48, 'Steam-Carta Colecionável de DARK SOULS™ III-The Cathedral of the Deep', 4),
        (2, 'Lothric Castle', 0.5, 'Steam-Carta Colecionável de DARK SOULS™ III-Lothric Castle', 4),
        (3, 'Road of Sacrifices', 0.48, 'Steam-Carta Colecionável de DARK SOULS™ III-The Road of Sacrifices', 4),
        (4, 'Undead Settlement', 0.48, 'Steam-Carta Colecionável de DARK SOULS™ III-The Undead Settlement', 4),
        (5, 'Moonlight Greatsword', 120.77, 'Arma de dragão lendária associada a Seath, o descamado.', 4),
        (6, 'Skull Lantern', 2.3, 'Seu principal objetivo é criar luz para uso em áreas escuras.', 1),
        (7, 'Anel do Dragão Imponente', 12, 'Aumenta o poder de todas as feitiçarias e piromancias em 20%.', 1),
        (8, 'Anel do Corte de Sangue', 4, 'Aumenta a resistência a sangramento em 400%.', 1),
        (9, 'Cápsula de Adesivos das Desafiantes Regionais do Antuérpia 2022', 5, 'Cápsula de Adesivos das Desafiantes Regionais do Antuérpia 2022', 16),
        (10, 'Cápsula de Adesivos das Desafiantes do Antuérpia 2022', 5, 'Esta cápsula contém um único adesivo de alta qualidade, purpurinado, holográfico ou dourado de uma das equipes participantes das Desafiantes do Antuérpia 2022. 50% da receita proveniente da venda desta cápsula será destinada às organizações inclusas. O adesivo pode ser aplicado a qualquer arma no seu inventário e pode ser raspado para parecer mais desgastado. Você pode raspar o mesmo adesivo múltiplas vezes, tornando-o cada vez mais desgastado, até ser removido da arma.', 16),
        (11, 'Cápsula de Adesivos das Lendas do Antuérpia 2022', 5, 'Esta cápsula contém um único adesivo de alta qualidade, purpurinado, holográfico ou dourado de uma das equipes participantes das Lendas do Antuérpia 2022. 50% da receita proveniente da venda desta cápsula será destinada às organizações inclusas. O adesivo pode ser aplicado a qualquer arma no seu inventário e pode ser raspado para parecer mais desgastado. Você pode raspar o mesmo adesivo múltiplas vezes, tornando-o cada vez mais desgastado, até ser removido da arma.', 16),
        (12, 'AK-47 | Tons de Preto', 50, 'Poderoso e confiável, o AK-47 é um dos rifles de assalto mais populares do mundo. Ele é mais mortal em rajadas curtas e controladas. Esta arma foi pintada de forma que só pode ser descrita como "uns quarenta tons de preto". "Ele tirou a parte preta da pintura com delicadeza, deixando-a somente preta"', 16),
        (13, 'AK-47 | Vulcan', 2000, 'Poderoso e confiável, o AK-47 é um dos rifles de assalto mais populares do mundo. Ele é mais mortal em rajadas curtas e controladas. Esta arma foi pintada com um design esportivo.', 16),
        (14, 'AK-47 | Asiimov', 360, 'Poderoso e confiável, o AK-47 é um dos rifles de assalto mais populares do mundo. Ele é mais mortal em rajadas curtas e controladas. Esta arma foi pintada com um design de ficção científica. Qualquer um pode prever o futuro... mas apenas um visionário pode moldá-lo', 16),
        (15, 'AK-47 | Arabesca Dourada', 8900, 'Poderoso e confiável, o AK-47 é um dos rifles de assalto mais populares do mundo. Ele é mais mortal em rajadas curtas e controladas. Esta arma foi pintada com um design intrincado na coronha e empunhadura. A parte de metal foi pintada com detalhes em filigrana dourados. "Que outros truques Booth tem nas mangas?"', 16),
        (16, 'AWP | Exoesqueleto', 10, 'A infame AWP é conhecida por recompensar aqueles que arriscam, sendo famosa pelo funcionamento "Um tiro, uma morte". Esta AWP foi prensada cuidadosamente com padrões de caveiras entrelaçadas. Potência máxima', 16),
        (17, 'AWP | Degradê', 7600, 'A infame AWP é conhecida por recompensar aqueles que arriscam, sendo famosa pelo funcionamento "Um tiro, uma morte". Esta arma foi pintada usando pinturas transparentes com o uso de um aerógrafo, que se misturam sobre um revestimento cromado. Esta não é apenas uma arma, é um bom assunto para uma conversa — Imogen, traficante de armas em treinamento', 16),
        (18, 'AWP | Descarga Elétrica', 4100, 'A infame AWP é conhecida por recompensar aqueles que arriscam, sendo famosa pelo funcionamento "Um tiro, uma morte". Esta arma foi pintada com um desenho inspirado em um raio sobre um revestimento metálico. Às vezes é desnecessário acertar duas vezes o mesmo lugar', 16),
        (19, 'AWP | Atheris', 23, 'A infame AWP é conhecida por recompensar aqueles que arriscam, sendo famosa pelo funcionamento "Um tiro, uma morte". Esta arma foi pintada à mão com a imagem uma víbora-das-árvores em verde e azul vibrantes por cima de um revestimento preto. Tão mortal quanto bela', 16),
        (20, 'Glock-18 | Degradê', 8700, 'A Glock-18 é uma boa pistola para começar a partida. É mais eficiente contra oponentes sem proteção e é capaz de disparar rajadas de três balas. Esta arma foi pintada usando pinturas transparentes com o uso de um aerógrafo, que se misturam sobre um revestimento cromado. Esta não é apenas uma arma, é um bom assunto para uma conversa — Imogen, traficante de armas em treinamento', 16),
        (21, 'Glock-18 | Vogue', 43, 'A Glock-18 é uma boa pistola para começar a partida. É mais eficiente contra oponentes sem proteção e é capaz de disparar rajadas de três balas. O ferrolho desta Glock chama atenção pela pintura personalizada de um par de olhos no estilo pop art. "Fique me olhando enquanto eu atiro em você!"', 16),
        (22, 'Glock-18 | Bronze', 111, 'A Glock-18 é uma boa pistola para começar a partida. É mais eficiente contra oponentes sem proteção e é capaz de disparar rajadas de três balas. Peças desta arma foram substituídas com latão. O tesouro dos desavisados', 16),
        (23, 'USP-S | Traíra', 154, 'Uma arma favorita dos fãs de Counter-Strike: Source, esta versão da pistola USP tem um silenciador removível que reduz o som e o coice dos disparos. Esta arma foi pintada usando a carta de tarô do Pendurado como inspiração. Fracassos pavimentam o caminho para o sucesso', 16),
        (24, 'USP-S | Inoxidável', 53, 'Uma arma favorita dos fãs de Counter-Strike: Source, esta versão da pistola USP tem um silenciador removível que reduz o som e o coice dos disparos. Esta arma possui um ferrolho de aço inoxidável.', 16),
        (25, 'Bandana das Vestimentas Chamas', 0.04, 'Vestimentas Costuradas nas Chamas; Bandana das Vestimentas Costuradas nas Chamas; Capa das Vestimentas Costuradas nas Chamas; Rachel, a Mordecego; Lenços e Molotov das Vestimentas Costuradas nas Chamas; Você sabe como é difícil encontrar uma bandana à prova de fogo?', 17),
        (26, 'Sombra do Firmamento Volátil', 0.07, 'Firmamento Volátil; Braçadeira do Firmamento Volátil; Lâmina do Firmamento Volátil; Ombreiras do Firmamento Volátil; Sombra do Firmamento Volátil; Elmo do Firmamento Volátil', 17),
        (27, 'Glaive do Assassino de Magos (Assombrado)', 6000, 'Assassino de Magos; Armadura do Assassino de Magos; Gargantilha do Assassino de Magos; Saia do Assassino de Magos; Glaive do Assassino de Magos; Braçadeira do Assassino de Magos; Glaive do Assassino de Magos — Secundária; Máscara do Assassino de Magos; A brutalidade determinou várias das antigas armas usadas pelo Anti-Mage.', 17)
    ` )
    
    await db.query( `insert into Inventario VALUES
        ('usuario1', 1),
        ('usuario1', 2),
        ('usuario1', 3),
        ('usuario1', 4),
        ('usuario1', 4),
        ('usuario3', 1),
        ('usuario3', 1),
        ('usuario1', 5),
        ('usuario4', 5),
        ('storage', 12),
        ('storage', 13),
        ('storage', 14),
        ('storage', 15),
        ('storage', 16),
        ('storage', 17),
        ('storage', 18),
        ('storage', 19),
        ('storage', 20),
        ('storage', 21),
        ('storage', 22),
        ('storage', 23),
        ('storage', 24),
        ('storage', 9),
        ('storage', 9),
        ('storage', 9),
        ('storage', 9),
        ('storage', 9),
        ('storage', 9),
        ('storage', 10),
        ('storage', 10),
        ('storage', 10),
        ('storage', 10),
        ('storage', 10),
        ('storage', 10),
        ('storage', 10),
        ('storage', 10),
        ('storage', 10),
        ('storage', 10),
        ('storage', 11),
        ('storage', 11),
        ('storage', 11),
        ('storage', 11),
        ('storage', 11),
        ('storage', 11),
        ('storage', 11),
        ('storage', 11),
        ('storage', 11),
        ('storage', 11),
        ('storage', 11),
        ('storage', 11),
        ('storage', 11),
        ('storage', 11),
        ('storage', 11)
    ` )

    await db.query( `insert into Mercado VALUES
        (1, 4, 'usuario1', 1),
        (2, 1, 'usuario3', 1.5),
        (3, 9, 'storage', 8),
        (4, 9, 'storage', 8),
        (5, 9, 'storage', 8),
        (6, 9, 'storage', 5),
        (7, 9, 'storage', 5),
        (8, 9, 'storage', 5),
        (9, 9, 'storage', 5),
        (10, 9, 'storage', 5),
        (11, 10, 'storage', 7),
        (12, 10, 'storage', 7),
        (13, 10, 'storage', 7),
        (14, 10, 'storage', 7),
        (15, 10, 'storage', 7),
        (16, 11, 'storage', 12),
        (17, 11, 'storage', 12),
        (18, 11, 'storage', 12),
        (19, 11, 'storage', 12),
        (20, 11, 'storage', 12),
        (21, 11, 'storage', 12),
        (22, 11, 'storage', 8),
        (23, 11, 'storage', 8),
        (24, 11, 'storage', 8),
        (25, 11, 'storage', 8),
        (26, 17, 'storage', 10000),
        (27, 23, 'storage', 100),
        (28, 20, 'storage', 7832)
    ` )

    await db.query( `insert into Discussoes VALUES
        (DEFAULT, 'Como fazer a Fire Keeper falar', 'Todo vez que eu tento interagir com a fire keeper de fire link ela não retorna respostas, alguém sabe o que fazer para ela falar?', 'usuario1', 1),
        (DEFAULT, 'Corridas noturnas', 'a quantidade de policiais aumenta durante a noite?', 'usuario2', 5),
        (DEFAULT, 'Modificação de armas', 'para subir o nivel da arma é necessario atingir uma quantidade de kills com ela', 'usuario3', 6),
        (DEFAULT, 'Modificação de veiculos', 'basta dirigir com o veiculo que ele ira subir de nivel', 'usuario3', 6),
        (DEFAULT, 'Tem algum macete para passar do Taurus Demon', 'Acabei de começar no jogo e estou tomando um pau pra esse chefe, alguem tem alguma dica?', 'usuario1', 1)
    ` )

    await db.query(`insert into Comentario VALUES
        (1, 1, 'usuario3', 'Não sei. Espero ter ajudado.'),
        (2, 1, 'usuario2', 'Devolver a alma de Anastacia à sua gaiola a reanimará, reativando a fogueira do Santuário de Firelink. Sua língua também será restaurada, permitindo que o jogador converse com ela.'),
        (3, 2, 'usuario1', 'Sim.');
    `)
    
    console.log('Valores inseridos.')
    await db.end()

}

insertTabelas()