import { NextApiRequest } from "next"
import { NextApiResponseServerIO } from "@/lib/websocket/types"
import { Server as NetServer } from "http"
import { Server as ServerIO } from "socket.io"
import { SocketHandler } from "@/lib/websocket/server"

export const config = {
  api: {
    bodyParser: false,
  },
}

const SocketHandler = require("../../../lib/websocket/server").default

export default function SocketRoute(req: NextApiRequest, res: NextApiResponseServerIO) {
  return SocketHandler(req, res)
}