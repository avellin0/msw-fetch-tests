import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest"
import { server } from "../../src/mock"
import { getAllUsers } from "tests/utils/getAllUsersFunction"


describe("Testando a URL para buscar todos os usuarios", () => {
    beforeAll(() => server.listen())
    afterEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it("Deve retornar uma lista com todos os usuarios", async () => {
        
        expect(getAllUsers()).resolves.toEqual({
            usuarios: [
                {nome: "Davi", idade: 18},
                {nome: "Wesley", idade: 27},
                {nome: "Adriano", idade: 43}
            ]
        });

    })
})



