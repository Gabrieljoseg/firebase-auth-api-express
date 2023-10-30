# Rotas
### Se o seu projeto é um aplicativo com API, liste as rotas e endpoints disponíveis, bem como as instruções para usá-las.

- /signup (Método: POST) - Rota para criar um novo usuário.
- /login (Método: POST) - Rota para fazer login e obter um token JWT.
- /curriculos (Método: GET) - Rota para listar todos os currículos.
- /curriculos/pessoa/:nome (Método: GET) - Rota para obter um currículo por nome.
- /curriculos/:id (Método: PUT) - Rota para atualizar um currículo por ID.
- '/curriculos/:id (Método: DELETE) -' Rota para excluir um currículo por ID.

#### Ao logar, se o usuário for admin, ele é redirecionado para uma página de admin. Caso contrário, ficará da mesma forma. 