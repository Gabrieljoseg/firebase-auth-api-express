<<<<<<< HEAD
# Documentação da API de Autenticação com Node.js, Express e Firebase

Este documento fornece uma visão geral do código da API de autenticação com Node.js, Express e Firebase.

## Tecnologias Utilizadas

- **Node.js**: Plataforma de tempo de execução para JavaScript no servidor.
- **Express**: Framework web para criação de APIs e aplicativos da web.
- **Firebase Authentication**: Serviço de autenticação do Firebase para criar e gerenciar contas de usuário.
- **Firebase Realtime Database**: Banco de dados do Firebase usado para verificar se um usuário é administrador e armazenar dados de administradores.
- **CORS (Cross-Origin Resource Sharing)**: Biblioteca para permitir solicitações de diferentes origens.
- **jsonwebtoken (JWT)**: Biblioteca para criar e verificar tokens JWT.
- **Firebase Admin SDK**: Usado para inicializar o Firebase no servidor.
- **dotenv**: Biblioteca para carregar variáveis de ambiente a partir de um arquivo `.env`.

## Rotas da API

### Rota Principal

- **Rota**: `/`
- **Descrição**: Rota principal que fornece informações sobre a API e suas rotas.

### Rota de Cadastro de Usuário

- **Rota**: `/signup`
- **Descrição**: Permite criar um novo usuário.

### Rota de Login e Token JWT

- **Rota**: `/login`
- **Descrição**: Realiza login e gera um token JWT para o usuário.
- **Logar com essas credenciais para entrar na rota de admin**: 
{
  "email":"josealmeida@girassol.com",
  "password": "615510"
}

### Rota Protegida para Administradores

- **Rota**: `/admin`
- **Descrição**: Rota protegida acessível apenas por administradores.

### Rotas para Currículos

- **Rota**: `/curriculos`
- **Descrição**: Lista todos os currículos.

- **Rota**: `/curriculos/pessoa/:nome`
- **Descrição**: Obtém um currículo por nome.

- **Rota**: `/curriculos`
- **Descrição**: Cria um currículo.

- **Rota**: `/curriculos/:id`
- **Descrição**: Atualiza um currículo por ID.

- **Rota**: `/curriculos/:id`
- **Descrição**: Exclui um currículo por ID.

## Middleware (estão no server.js)

### Middleware de Verificação de Token

- **Descrição**: Verifica a autenticidade do token JWT fornecido nas solicitações.

### Middleware de Verificação de Administrador

- **Descrição**: Verifica se o usuário é um administrador antes de permitir o acesso a rotas protegidas.

## Configuração do Servidor

- **Porta do Servidor**: A API é configurada para escutar na porta 3000, com a opção de usar uma porta especificada nas variáveis de ambiente.



Este documento fornece uma visão geral do código da API de autenticação com Node.js, Express e Firebase. Consulte o código-fonte para obter detalhes completos.

=======
# api-REST-curriculo
>>>>>>> 48c679e0 (commit-jotaesse)
