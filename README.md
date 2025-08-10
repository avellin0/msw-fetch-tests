# 🚫 msw-fetch-tests: Aprenda MSW com exemplos reais.

Este repositório é um **playground didático**, focado em usar o **MSW (Mock Service Worker)** para simular APIs nos testes front-end de forma realista.  
Aqui, o objetivo é mostrar como testar seus componentes e lógica com `fetch`, sem precisar de um back-end real.

site oficial: https://mswjs.io/docs

---

## 🧠 O que você vai encontrar aqui

- Handlers que simulam rotas HTTP (`/usuarios`, `/usuario/:nome`) usando MSW.  
- Testes com **Vitest + MSW** para cenários de sucesso e erro.  
- Função `getUser(name)` exportada para abstrair chamadas de API com tratamento de erros.  
- Exemplos reais de:  
  - Retorno com status 200 e JSON válido.  
  - Retorno com status 400 e mensagem customizada.  
  - Testes que verificam `rejects.toThrow` corretamente.  

---

# Por que usar MSW?

### Desenvolver sem depender de uma API pronta  
- Muitas vezes o backend ainda não está finalizado, mas o frontend precisa avançar.  
- Com o MSW, você já simula as respostas da API e continua trabalhando normalmente.  
- Isso evita aquele clássico:  
  > “não dá para testar porque o servidor está fora do ar”.  

### Testes mais rápidos e confiáveis  
- Testes que dependem de APIs reais podem ser lentos e instáveis (servidor caindo, internet lenta, dados mudando).  
- O MSW garante respostas previsíveis e consistentes para cada cenário de teste.  
- Ideal para TDD e testes de integração no frontend.  

### Evitar custos com APIs reais  
- Se a API for cobrada por uso (como OpenAI, Stripe, etc.), testar com ela pode gerar gastos desnecessários.  
- O MSW simula as respostas e evita chamadas desnecessárias durante desenvolvimento e testes.  
- Funciona tanto no browser quanto no Node.js.  

### No browser, ele usa Service Workers para interceptar as requisições  
- No Node.js, ele intercepta chamadas de `fetch` e `axios` sem precisar de um service worker.  
- Assim, você pode usar o mesmo setup tanto no app real quanto nos testes automatizados.  

---

# MSW por debaixo dos panos  

Quando você faz uma requisição HTTP no seu código, seja usando `fetch`, `axios` ou outra coisa, normalmente ela vai direto para a rede — ou seja, para o servidor real.  
O MSW entra no meio desse caminho para capturar essa requisição antes dela sair e responder com uma versão simulada (mock).  

---

## Mas como isso funciona, afinal?

### No browser: Service Worker  
O MSW usa uma tecnologia chamada Service Worker, que é tipo um `“agente”` que fica entre seu navegador e a internet.  
Esse agente pode escutar todas as requisições que seu código faz (`fetch`, `XMLHttpRequest`) e decidir se deixa passar ou se responde ele mesmo.  
Então, quando você usa MSW no browser, o Service Worker intercepta as chamadas de rede e, se encontrar um mock configurado para aquela URL,  
ele devolve o dado simulado sem nem precisar ir à internet.  

---

## No Node.js (ex: testes no VSCode)  

- Como o Node não tem Service Workers, o MSW usa outra estratégia.  
- Ele substitui internamente as funções responsáveis por fazer requisições HTTP, como o `fetch` ou o adaptador do axios.  
- Ou seja, quando seu teste chama `fetch()`, na verdade está chamando uma versão “turbinada” pelo MSW que verifica se existe um mock configurado.  
- Se tiver, ele retorna a resposta simulada direto ali, sem sair da máquina ou acessar a rede.  

---

## O resultado: testes rápidos, confiáveis e sem dependência externa  

- Com essa interceptação, seus testes ficam independentes do backend real ou da conexão com a internet.  
- Isso garante que eles rodem rápido, sempre com os mesmos dados, e evita falhas causadas por instabilidade na rede ou no servidor.  

---

# 🛠️ Como rodar e reproduzir

1. Clone o repositório:  
```bash
git clone https://github.com/avellin0/msw-fetch-tests.git
cd msw-fetch-tests
```

2. Instale as dependencias:
```bash
npm install
```

3. Rode os testes:
```bash
npm run test
````
Todos os testes vão rodar com o MSW interceptando as chamadas HTTP simuladas

---

# 🚀 Criando e testando handler

Primeiro, devemos baixar o MSW:

```bash
npm i msw --save-dev
````

Depois de instalado, vamos importar duas funcionalidades (http e HttpResponse):

```js
import { http, HttpResponse } from "msw"
````

Ótimo! Agora vamos criar uma variável que recebe um array:

```js
const handlers = []
````
Com o array pronto, vamos usar uma das funcionalidades do MSW. O http serve para criarmos uma rota falsa/mock. A estrutura do http é simples, existem dois tipos de requisições suportadas:

```js

// GET na URL que passar
http.get('/user', resolver)

// POST na URL que passar
http.post('/post/:id', resolver)

````

Em nosso exemplo, vamos usar somente o get. Dentro do nosso array, vamos criar um mock de uma URL:

```js
const handlers = [
  http.get("http://localhost:3000/usuarios", () => {})
]
````

Perceba que essa URL não retorna nada `(() => {})`. Agora vamos usar o `HttpResponse`, que retorna o valor mockado (o que desejamos retornar sempre que batermos nessa URL). Aqui vamos retornar um método `json()` próprio do HttpResponse para nos dar um JSON:

```js
const handlers = [
  http.get("http://localhost:3000/usuarios", () => {
    return HttpResponse.json({
      usuarios: [
        { nome: "Davi", idade: 18 },
        { nome: "Wesley", idade: 27 },
        { nome: "Adriano", idade: 43 }
      ]
    })
  })
]
````

Boa! Você acabou de mockar uma API. Agora vamos exportar esse array, pois faltam mais dois passos para fazer mocks como profissional:

```js
export const handlers = [
  // ... mesma coisa
]
````

## Configurando servidor Node.js
Agora que já temos um array handlers com nosso mock de uma API, precisamos importar nosso array e usar uma única funcionalidade do MSW:

```js
import { setupServer } from "msw/node"
import { handlers } from "./handlers/handlerHttp"

export const server = setupServer(...handlers)
````

Esse `setupServer` configura o servidor MSW no ambiente Node.js para interceptar as requisições durante os testes. Então, criamos uma variável que será chamada nos nossos testes e passamos como valor dela a função setupServer com nossos handlers como parâmetro.

## Testando nosso handler

Parabéns! Essa é a última e melhor parte. Agora vamos criar um teste simples usando esse MSW. Bom, se lembra que criamos o server. Como o nome já indica, ele funciona como um servidor que roda em uma porta. Em nossos testes, devemos iniciar esse server e voilà! Está pronto, podemos fazer requisições usando fetch, axios, insomnia [...]. Vamos ver isso na prática:

```js
import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest"
import { server } from "../../src/mock"
import { getAllUsers } from "tests/utils/getAllUsersFunction" // Esse é um wrapper que criei para

describe("Testando a URL para buscar todos os usuários", () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it("Deve retornar uma lista com todos os usuários", async () => {
    const getAllUsers = await fetch("http://localhost:3000/usuarios")

    await expect(getAllUsers.json()).resolves.toEqual({
      usuarios: [
        { nome: "Davi", idade: 18 },
        { nome: "Wesley", idade: 27 },
        { nome: "Adriano", idade: 43 }
      ]
    })
  })
})
````

Aqui temos um teste básico feito com vitest, porém o que gostaria que você notasse é o uso de beforeAll(), afterEach() e afterAll(), onde:

- iniciamos o server com `server.listen()`,
- depois de cada teste, os handlers são resetados com `server.resetHandlers()`, para que os dados de um teste não interfiram nos outros,
- por último, após todos os testes, fechamos o server com `server.close()`.

Assim, você termina nossa mini-aula sobre MSW e está preparado(a) para criar testes como profissional.

---
# 📁 Estrutura do projeto

```tree
stop-mocking-fetch/
├── src/
│   └── mock/
│       ├── handlers/
│       │   └── handlerHttp.ts # Handlers MSW para usuários
│       └── mock.ts # compilador MSW em Node
├── tests/
│   ├── usuarios/
│   │   ├── getAllUsers.test.ts
│   │   ├── getUserByName.test.ts
│   │   └── invalidUserParam.test.ts
│   └── utils/
│       ├── getAllUsersFunction.ts # wrapper da função getAllUsers()
│       └── getUniqueUserFunction.ts # wrapper da função getUser()
├── package.json
├── tsconfig.json
└── README.md
````

---

# 😉 Algumas ferramentas/utils para você

✅ Handler de erro por parâmetro

```js
http.get("/usuario/:nome", ({ params }) => {
  if (/[^a-zA-Z]/.test(params.nome)) {
    return HttpResponse.json({ message: "Erro no tipo de argumento" }, { status: 400 });
  }
})
✅ Wrapper getUser(name: string)
````

---

```js
export async function getUser(name: string) {
  if (typeof name !== "string") throw new Error("Erro no tipo de argumento");
  if (!name.trim()) throw new Error("Nome não pode ser vazio");

  const res = await fetch(`http://localhost:3000/usuario/${name}`);
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Erro desconhecido");
  return data;
}
````
---
# 📋 O que você pode aprender
📌 Como usar o MSW v2 com http.get e HttpResponse.json

✔️ Boas práticas para estruturar testes com Vitest

🧪 Como criar wrappers que tratam erros da API corretamente

🚪 Como o MSW permite simular cenários de erro antecipadamente

🔀 Comparação prática: mock de função vs mock de rede reais

🤝 Contribuições
Contribuições são super bem-vindas! Sinta-se à vontade para:

- Fazer um fork e criar novos handlers (ex: POST /login, DELETE /usuario/:id)
- Escrever mais testes
- Sugerir melhorias no README, na estrutura do projeto ou no código

---

# Documentação oficial
https://mswjs.io/docs

