import {vi} from "vitest"

export const getAllUsers = vi.fn(async() => {
    const url = "http://localhost:3000/usuarios"

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