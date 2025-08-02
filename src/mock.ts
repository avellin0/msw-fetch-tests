import {setupServer} from "msw/node"
import {handle} from "./Handlers/handle/handle.start"

export const server = setupServer(...handle)
