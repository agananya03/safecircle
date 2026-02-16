
import { io as ClientIO } from "socket.io-client";

export const socket = ClientIO(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000", {
    path: "/api/socket/io",
    autoConnect: false,
});
