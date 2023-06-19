README.md

# kugel-server

## Descrição

O módulo **kugel-server** tem como objetivo iniciar o servidor express, dentro do framework kugel. Ele oferece uma configuração simplificada através do arquivo `package.json`, possui integração com socket.io e permite a configuração de middlewares, rotas estáticas e views para renderização.

Usar o kugel-server em vez do express diretamente traz vantagens como:
- Configuração centralizada no arquivo `package.json` do projeto
- Integração com o sistema de componentes do kugel
- Inclusão de recursos como logs de IPs e suporte a múltiplos mecanismos de visualização.

Recomenda-se o uso do kugel-server apenas para configurar views, arquivos estáticos e middlewares, e o uso do kugel-better-express para a criação de rotas e controllers.

## Instalação

Instale o módulo como uma dependência do seu projeto:

```bash
npm install --save github:pliffer/kugel-server
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

### Variáveis de ambiente

O kugel-server utiliza as seguintes variáveis de ambiente para definir a porta, host e protocolo do servidor:

- `process.env.PORT`: Defina a porta do servidor (padrão: 8080)
- `process.env.HOST`: Defina o host do servidor (padrão: 'localhost')
- `process.env.PROTOCOL`: Defina o protocolo do servidor (padrão: 'http')

### Importação e inicialização

Para utilizar o kugel-server, importe-o e inicialize conforme o exemplo abaixo:

```js
const { app, io } = require('kugel-server');

// Ativa uma pasta de arquivos estáticos
app.static.add('./public');

// Adiciona um middleware
app.middleware.add((req, res, next) => {
    // Código do middleware...
});

// Adiciona um caminho para views
app.views.add('./views');
```

Quando utilizado em conjunto com `kugel-better-express`, você pode definir facilmente as rotas da aplicação.

### Trabalhando com socket.io

Se você ativou a opção de integração com socket.io na configuração do `kugel.config`, o kugel-server retornará um objeto `io` juntamente com o objeto `app`. Você pode utilizar o `io` para configurar e gerenciar eventos do socket.io e emitir mensagens no servidor.

Exemplo de como gerenciar eventos do socket.io:

```js
io.on('connection', (socket) => {
    console.log('Usuário conectado...');

    socket.on('mensagem', (data) => {
        console.log(`Mensagem recebida: ${data}`);
    });

    socket.on('disconnect', () => {
        console.log('Usuário desconectado...');
    });
});
```

## API

### app

#### .static

Propriedades disponíveis:

- `add(folder, options)`: adiciona uma pasta de arquivos estáticos com as opções fornecidas.

#### .middleware

Propriedades disponíveis:

- `add(middleware)`: adiciona um middleware express.

#### .views

Propriedades disponíveis:

- `add(viewPath)`: adiciona um caminho para as views da aplicação.

### io (apenas se habilitado através da configuração `kugel.config.socketio`)

- Gerencie eventos e emita mensagens usando a API socket.io.

## Work in progress

1. Explicar como configurar o servidor para casos específicos que não foram mencionados na documentação.