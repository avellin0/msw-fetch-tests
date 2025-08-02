import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest"
import { server } from "../../src/mock"
import { getUser } from "tests/utils/getUniqueUserFunction"


describe("Busca um unico usuario por nome", () => {
    beforeAll(() => server.listen())
    afterEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it("should return a simple guy", async() => {
        const result = getUser('Davi')
        
        expect(result).resolves.toEqual({
            nome: "Davi",
            idade: 18,
            email: "Davi@gmail.com"
        })
    })
})



