const db = require('./db')

async function createTriggers(){

    await db.connect()

    await db.query(`create or replace function adicionaMercado()
    returns trigger
    language plpgsql
    as $$
    begin
        delete from inventario
        where login = new.login and idItem = new.idItem;
        return NULL;
    end;$$`)

    await db.query(`create or replace trigger mercado_insert
    after insert on mercado
    for each row 
    execute procedure adicionaMercado()`)

    await db.query(`create or replace function jogoPublicado()
    returns trigger
    language plpgsql
    as $$
    declare 
        dono_estudio VARCHAR(30);
        nome_estudio VARCHAR(60);
    begin
        select login, nomeestudio into dono_estudio, nome_estudio from desenvolvedor 
        natural join publicacao
        where nomeestudio = new.estudio;
        
        insert into discussoes values
        (nextval('discussao_seq'), concat('Nós da ',nome_estudio, ' publicamos um novo jogo!'), 'Venha conferir nosso novo jogo e utilize esse topico para reviews', dono_estudio, new.idjogo);
        return null;
    end;$$`)

    await db.query(`create or replace trigger publicacao_insert
    after insert on publicacao
    for each row 
    execute procedure jogoPublicado()`)

    console.log('Triggers criados.')
    await db.end()
}

createTriggers()