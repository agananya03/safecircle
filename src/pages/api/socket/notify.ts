
import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/lib/socket/server";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIO
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { room, event, data } = req.body;

    if (!room || !event || !data) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const io = res.socket.server.io;

    if (!io) {
        // This connects the socket server if it wasn't already connected
        // But ideally it should be connected by the client hitting /api/socket/io
        return res.status(500).json({ error: "Socket server not initialized" });
    }

    try {
        io.to(room).emit(event, data);
        return res.status(200).json({ message: "Event emitted" });
    } catch (error) {
        console.error("Error emitting socket event:", error);
        return res.status(500).json({ error: "Internal Error" });
    }
}
