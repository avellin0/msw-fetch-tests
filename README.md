# 🚫 msw-fetch-tests: Aprenda MSW com exemplos reais

Este repositório é um **playground didático**, focado em usar o **MSW (Mock Service Worker)** para simular APIs nos testes front-end de forma realista.  
Aqui o objetivo é te mostrar como testar seus componentes e lógica com `fetch`, sem precisar de um back-end real.

---

## 🧠 O que você vai encontrar aqui

- Handlers que simulam rotas HTTP (`/usuarios`, `/usuario/:nome`) usando MSW.
- Testes com **Vitest + MSW** para cenários de sucesso e erro.
- Função `getUser(name)` exportada para abstrair chamadas de API com tratamento de erros.
- Exemplos reais de:
  - Retorno com status 200 e JSON válido
  - Retorno com status 400 e mensagem customizada
  - Testes que verificam `rejects.toThrow` corretamente

---

## 📁 Estrutura do projeto
````text
stop-mocking-fetch/
├── src/
│ └── mock/
│ ├── handler/
│ │ └── handlerHttp.ts # Handlers MSW para usuários
│ └── mock.ts # compilador MSW em Node
├── tests/
│ ├── usuarios/
│ │ ├── getAllUsers.test.ts
│ │ ├── getUserByName.test.ts
│ │ └── invalidUserParam.test.ts
│ └── utils/
│ │ ├── getAllUsersFunction.ts # wrapper da função getAllUsers()
│ │ └── getUniqueUserFunction.ts # wrapper da função getUser()
├── package.json
├── tsconfig.json
└── README.md
...
````
---

## 🛠️ Como rodar e reproduzir

1. Clone o repositório:
````
   git clone https://github.com/avellin0/msw-fetch-tests.git
   cd msw-fetch-tests
`````
2. Instale as dependências:
````
npm install
````
4. Rode os testes:
````
npm run test
````

Todos os testes vão rodar com o MSW interceptando as chamadas HTTP simuladas.

---

# Como usar o msw:

 Primeiro devemos baixar o msw: 
 ````bash
  npm i msw --save-dev
`````

  Depois de instalado, vamos importar duas funcionalidades (http e HttpResponse):

  ```bash
    import {http, HttpResponse} from "msw"
  ````

  Otimo! agora vamos criar uma variavel que recebe um array:

   ```bash
    const handle = []
  ````

  Agora com o Array pronto vamos usar uma das funcionalidades do msw o `http` essa funcionalide server para criarmos uma rota falsa/mock. A estrutura do http é simples, existem duas tipos de requisições suportadas:
  ````
  http.get('/user', resolver) # Faz um get da url que passar
  http.post('/post/:id', resolver) # Faz um get da url que passar
  ````

  Em nosso exemplo vamos usar somente o `get`, dentro do nosso array, vamos criar um mock de uma url:

  ````
    const handle = [
      http.get("http://localhost:3000/usuarios", () => {})
    ]
  ````

  Perceba que essa url não retorna nada `(() => {})`, agora que vemos a funcionalidade principal, agora vamos usar o `HttpResponse`, onde nos retorna o valor mockado (Oque desejamos retornar sempre que batermos nessa url), aqui vamos retornar um  metodo próprio do HttpResponse para nos dar um JSON:

  ````
    const handle = [
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
  Boa! você acabou de mockar uma API, agora vamos exportar esse array pois falta mais dois passos para fazer mocks como profissional

  ````
    export const handle = [
        ... # mesma coisa
      ]
  ````

### Compilando o Handle

Agora que ja temos um array `handle` com nosso mock de uma API, precisamos tranformar esse código `ts` em `js` para isso devemos importar nosso array e usar uma unica funcionalidade do msw:

````bash
  
````
  

---

✅ Handler de erro por parametro

````
http.get("/usuario/:nome", ({ params }) => {
  if (/[^a-zA-Z]/.test(params.nome)) {
    return HttpResponse.json({ message: "Erro no tipo de argumento" }, { status: 400 });
  }
})

````
✅ Wrapper getUser(name: string)

````
export async function getUser(name: string) {
  if (typeof name !== "string") throw new Error("Erro no tipo de argumento");
  if (!name.trim()) throw new Error("Nome não pode ser vazio");
  
  const res = await fetch(`http://localhost:3000/usuario/${name}`);
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Erro desconhecido");
  return data;
}
````

## 📋 O que você pode aprender
- 📌 Como usar o MSW v2 com http.get e HttpResponse.json

- ✔️ Boas práticas para estruturar testes com Vitest

- 🧪 Como criar wrappers que tratam erros da API corretamente

- 🚪 Como o MSW permite simular cenários de erro antecipadamente

- 🔀 Comparação prática: mock de função vs mock de rede reais

🤝 Contribuições
Contribuições são super bem-vindas!
Sinta-se à vontade para:

- Fazer um fork e criar novos handlers (ex: POST /login, DELETE /usuario/:id)

- Escrever mais testes

- Sugerir melhorias no README, na estrutura do projeto ou no código

