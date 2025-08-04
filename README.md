# 🚫 Stop‑Mocking‑Fetch: Aprenda MSW com exemplos reais

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
├── public/
│ └── mockServiceWorker.js # MSW Worker para ambiente browser
├── src/
│ └── mock/
│ ├── handlers/
│ │ └── userHandler.ts # Handlers MSW para usuários
│ └── server.ts # Setup do servidor MSW em Node
├── tests/
│ ├── usuarios/
│ │ ├── getAllUsers.test.ts
│ │ ├── getUserByName.test.ts
│ │ └── invalidUserParam.test.ts
│ └── utils/
│ └── getUserFunction.test.ts # Testes da função getUser()
├── src/utils/
│ └── getUser.ts # Wrapper de fetch que lança erros
├── package.json
├── vitest.config.ts
└── README.md
````
---

## 🛠️ Como rodar e reproduzir

1. Clone o repositório:
````
   git clone https://github.com/avellin0/stop-mocking-fetch.git
   cd stop-mocking-fetch
`````
2. Instale as dependências:
````
npm install
# ou
yarn
````
3. inicialize o MSW no diretório public/:
```
npm run msw:init
````
4. Rode os testes:
````
npm test
# ou
yarn test
````
Todos os testes vão rodar com o MSW interceptando as chamadas HTTP simuladas.

📌 Exemplos que você verá
✅ Handler de sucesso (usersHandler.ts)

````
http.get("/usuarios", () => {
  return HttpResponse.json({
    usuarios: [
      { nome: "Davi", idade: 18 },
      { nome: "Wesley", idade: 27 },
      { nome: "Adriano", idade: 43 }
    ]
  })
})

````
✅ Handler de erro personalizado

````
http.get("/usuario/:nome", ({ params }) => {
  if (/[^a-zA-Z]/.test(params.nome)) {
    return HttpResponse.json({ message: "Erro no tipo de argumento" }, { status: 400 });
  }
  return HttpResponse.json({ nome: params.nome, idade: 18, email: `${params.nome}@gmail.com` });
})

````
✅ Wrapper profissional getUser(name: string)

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

