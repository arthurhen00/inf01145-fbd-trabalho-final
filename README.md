# inf01145-fbd-trabalho-final  

```
npm install  
npm run dci  
npm run server  
npm start  
```

| Etapa         | Descrição Resumida | Data Entrega | Peso |
| ------------- | ------------------ | ------------ | ---- |
| Formação de Duplas | Informar dupla | 8/01 | 0% |
| Etapa I   | 1) Projeto Conceitual <br /> 2) Projeto Lógico da Base de Dados (em SGBD Relacional)            | 29/01*               | 35%            |
| Etapa II  | 1) Correções no Projeto Conceitual/Lógico da Etapa 1 <br /> 2) Elaboração de consultas e visões | 26/03* <br /> 26/03* | 10% <br /> 40% |
| Etapa III | 1) implementação do programa que acessa a base de dado e gatilho (vídeo**)                      | 05/04*               | 15%            |

### Etapa 3: Item 1) Acessando a base de dados através de um programa  
**Item1.a)** Construir um programa que permita fazer manipulações em sua base de dados. Você tem a opção de escolher
a linguagem de programação que quiser. Seu programa deve permitir:  
- conexão com a base de dados;  
- executar todas consultas SQL definidas no item 2.(b), mostrando os resultados. Preveja que pelo menos 3 destas
consultas recebam parâmetros para sua execução (e.g. se a consulta é select nome from empregado where nome =
‘joao’, sua interface deve permitir que o valor “joao” - ou “Pedro” - seja definido em tempo de execução). As
consultas com parâmetros devem utilizar necessariamente os recursos para manipulação de parâmetros da
biblioteca usada (i.e. não se limite a tratar a string para incluir or parâmetros, use as funções específicas);  
- Dispare o gatilho e execute o procedimento armazenado.  

A interface do programa deve permitir demonstrar as funcionalidades acima. Interfaces com o usuário elaboradas não são
necessárias, e **não serão valorizadas** (ou seja, use seu tempo no que é prioritário). É vedado o uso de frameworks que
tornem obscuros os detalhes de conexão com a base de dados.
