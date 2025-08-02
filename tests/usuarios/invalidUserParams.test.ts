import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest"
import { server } from "../../src/mock"
import { getUser } from "tests/utils/getUniqueUserFunction"


describe("Tentando criar um erro por parâmetro incorreto", () => {
    beforeAll(() => server.listen())
    afterEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it("should throw a error", async () => {
        await expect(getUser("123")).rejects.toThrow("Erro no tipo de argumento")
    })
})



