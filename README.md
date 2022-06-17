# Teste: Leitor de Linhas Digitáveis de códigos de Barra de Boletos (Bancário e Arrecadação)

## Este projeto é uma API de leitor de linhas digitáveis de código de barra (Bancários e Arrecadação)
## Linguagem: JavaScript
### Tecnologias usadas foram: Node.js, Express.js, jest.js e nodemon 

  > Este projeto é um teste prático de desenvolvimento BackEnd Node.js  

Para iniciar a API: 
  > Certifique-se de possuir o node.js instalado em sua máquina 

**INICIAR A API**
1. Fazer download ou cópia do repositório
2. Abra a pasta raiz no Terminal CMD ou Power Shell
3. Digite o comando **npm install**: será criada a pasta *node_modules* na pasta raiz do projeto
4. Digite o comando **npm start** para iniciar a aplicação: Se estiver tudo ok aparecerá a seguinte mensagem no CMD: *Server Funcionando: http://localhost:8080*
5. Digite essa rota no navegador: http://localhost:8080/boleto/
6. Após a barra, digite o valor numérico da linha digitável do boleto. Ex: *http://localhost:8080/boleto/00190000090337049401914747830173488840000004780*
7. Se o código for válido será retornado (response com status 200) um JSON com os seguintes informações: barCode (Código de Barra), amount (Valor), expirationDate (Data de Vencimento)
8. Obs: Os valores de valor (amount) e data de vencimento podem não existir mesmo que a linha digitável seja válida
9. Se a linha digitável não for válida, o response terá status 400. Isso será impresso no Browser: *Status: 400*

**TESTES (jest.js)**
1. Para os testes unitários, abra o CMD ou Power Shell na pasta raiz do projeto
2. Digite o comando: **npm run test** para iniciar todos os testes
3. Digite o comando: **npm run test .\testes\arrecadacaoCaracteristicasDVs.spec.js**
4. Digite o comando: **npm run test .\testes\arrecadacaoRetorno.spec.js**
5. Digite o comando: **npm run test .\testes\bancarioCaracteristicasDVs.spec.js**
6. Digite o comando: **npm run test .\testes\bancarioRetorno.spec.js**
7. Obs1: As linhas digitáveis usadas para os teste devem ser colocadas manualmente no editor de texto/código de sua prefêrencia
8. Obs2: Para entender as funções de cada teste leia os comentários escritos entre os códigos dos testes 
