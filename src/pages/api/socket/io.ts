
import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { NextApiResponseServerIO } from "@/lib/socket/server";

export const config = {
    api: {
        bodyParser: false,
    },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
    console.log("Socket handler called");
    if (!res.socket.server.io) {
        console.log("Initializing Socket.io server...");
        const path = "/api/socket/io";
        const httpServer: NetServer = res.socket.server as any;
        const io = new ServerIO(httpServer, {
            path: path,
            addTrailingSlash: false,
        });

        io.on("connection", (socket) => {
            console.log("Socket connected:", socket.id);

            socket.on("join-circle", (circleId: string) => {
                socket.join(circleId);
                console.log(`Socket ${socket.id} joined circle ${circleId}`);
            });

            socket.on("leave-circle", (circleId: string) => {
                socket.leave(circleId);
                console.log(`Socket ${socket.id} left circle ${circleId}`);
            });

            socket.on("disconnect", () => {
                console.log("Socket disconnected:", socket.id);
            });
        });

        res.socket.server.io = io;
    }
    res.end();
};

export default ioHandler;
