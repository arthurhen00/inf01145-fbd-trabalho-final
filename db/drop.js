const db = require('./db')

async function dropTabelas(){

    await db.connect()

    await db.query('drop table if exists Inventario CASCADE')
    await db.query('drop table if exists Conteudo CASCADE')
    await db.query('drop table if exists Publicacao CASCADE')
    await db.query('drop table if exists Desenvolvedor CASCADE')
    await db.query('drop table if exists Pedido CASCADE')
    await db.query('drop table if exists Biblioteca CASCADE')
    await db.query('drop table if exists Mercado CASCADE')
    await db.query('drop table if exists Discussoes CASCADE')
    await db.query('drop table if exists Usuario CASCADE')
    await db.query('drop table if exists Classificacao CASCADE')
    await db.query('drop table if exists Jogos CASCADE')
    await db.query('drop table if exists Genero CASCADE')
    await db.query('drop table if exists Item CASCADE')
    await db.query('drop table if exists Comentario CASCADE')
    await db.query('drop table if exists Carrinho CASCADE')

    await db.query('drop sequence if exists pedido_seq CASCADE')
    await db.query('drop sequence if exists anuncio_seq CASCADE')
    await db.query('drop sequence if exists comentario_seq CASCADE')
    await db.query('drop sequence if exists discussao_seq CASCADE')

    console.log('Tabelas removidas.')
    await db.end()

}

dropTabelas()