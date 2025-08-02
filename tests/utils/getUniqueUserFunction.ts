import { describe, it, expect, vi, beforeAll, afterEach, afterAll } from "vitest"
import { server } from "src/mock"

export const getUser = vi.fn(async (arg?) => {

    const endpoint = arg?.toString().trim()

    const url = endpoint ? `http://localhost:3000/usuario/${endpoint}` : `http://localhost:3000/usuario`

    try {
        const users = await fetch(url)

        if (!users.ok) {
            const data = await users.json()
            throw new Error(data.message || "Erro desconhecido")
        }

        return users.json()

    } catch (error: any) {
        throw new Error(error.message || "Erro ao buscar usuario")
    }

})

describe("Teste de mocks com vi", () => {
    beforeAll(() => server.listen())
    afterEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it("Deve buscar usuario", async () => {
        expect(getUser("Davi")).resolves.toEqual({
            nome: "Davi",
            idade: 18,
            email: "Davi@gmail.com"
        })
    })

    it("Deveria lançar um erro por argumento inválido", async () => {
        await expect(getUser(123)).rejects.toThrow("Erro no tipo de argumento")
    })

    it("Deve dar erro por falta de argumento", async () => {
        await expect(getUser("")).rejects.toThrow("Usuario nao encontrado")
    })
})