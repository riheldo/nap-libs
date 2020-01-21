# NAP-INTERFACES

Essa biblioteca tem o intuito de abstrair as requisições e respostas do servidor `reman`.


## NAPConnectionService

O serviço de conexão é o agragador final da requisição. Ele é dividido em duas partes, `NAPConnectionService` e `NAPConnectionModel`, qualquer operação no service retornara uma instancia do model, assim isolando o contexto transacional.


## NAPAuthService

Serviço responsável pelas operações de authenticaçoes junto ao acesso ao usuário.