# kugel-server

## Descrição

O módulo **kugel-server** tem como objetivo iniciar o servidor express, dentro do framework kugel. Ele possui integração com socket.io e permite a configuração de middlewares, rotas estáticas e views para renderização.

Recomenda-se o uso do kugel-server apenas para configurar views, arquivos estáticos e middlewares, e o uso do kugel-better-express para a criação de rotas e controllers.

## Instalação

Instale o módulo como uma dependência do seu projeto:

```bash
npm install --save kugel-server
```

## Uso

### Configuração

No arquivo `package.json` do projeto, configure o objeto `kugel.config` de acordo com suas necessidades.

Exemplo de configuração:

```json
"kugel": {
    "config": {
        "morgan": "dev",
        "template_engine": "ejs",
        "socketio": true,
        "logs": {
            "ips": true
        }
    }
}
```

### Importação e inicialização

Para utilizar o kugel-server, importe-o e inicialize conforme o exemplo abaixo:

```js
const kugelServer = require('kugel-server');

// Ativa uma pasta de arquivos estáticos
kugelServer.static.add('./public');

// Adiciona um middleware
kugelServer.middleware.add((req, res, next) => {
    // Código do middleware...
});

// Adiciona um caminho para views
kugelServer.views.add('./views');
```

## API

### kugelServer

#### .static

Propriedades disponíveis:

- `add(folder, options)`: adiciona uma pasta de arquivos estáticos com as opções fornecidas.

#### .middleware

Propriedades disponíveis:

- `add(middleware)`: adiciona um middleware express.

#### .views

Propriedades disponíveis:

- `add(viewPath)`: adiciona um caminho para as views da aplicação.

## Work in progress

1. Como configurar o servidor para casos específicos que não foram mencionados na documentação?
2. Como adicionar rotas à aplicação e lidar com diferentes métodos HTTP?
3. Estão disponíveis outros tipos de logs além de endereços IPs?
4. Como usar o socket.io com o kugel-server? Qual é o processo para configurar e utilizar eventos ou emitir mensagens usando o socket.io em conjunto com o servidor?