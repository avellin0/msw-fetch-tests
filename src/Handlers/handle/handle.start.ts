import { http, HttpResponse } from "msw"

export const handle = [
    http.get("http://localhost:3000/usuarios", () => {
        return HttpResponse.json({
            usuarios: [
                { nome: "Davi", idade: 18 },
                { nome: "Wesley", idade: 27 },
                { nome: "Adriano", idade: 43 }
            ]
        })
    }),

    http.get("http://localhost:3000/usuario/:nome", ({ params }) => {
        const { nome } = params

        const name = String(nome).trim()

        if (/[^a-zA-Z]/.test(name)) {
            return HttpResponse.json(
                { message: "Erro no tipo de argumento" },
                { status: 400 },
            )
        }

        return HttpResponse.json({
            nome: "Davi",
            idade: 18,
            email: "Davi@gmail.com"
        }, { status: 200 })
    }),

    http.get("http://localhost:3000/usuario", () => {
        return HttpResponse.json(
            { message: "Usuario nao encontrado" },
            { status: 404 }
        )
    })
]
