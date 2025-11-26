import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  room: string;
}

let allSockets: User[] = [];

wss.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("message", (raw) => {
    let parsed;
    try {
      parsed = JSON.parse(raw.toString());
    } catch {
      return;
    }

    // JOIN ROOM
    if (parsed.type === "join") {
      allSockets.push({
        socket,
        room: parsed.payload.roomId,
      });
      return;
    }

    // SEND CHAT MESSAGE TO SAME ROOM
    if (parsed.type === "chat") {
      const userRoom = allSockets.find((u) => u.socket === socket)?.room;
      if (!userRoom) return;

      const msg = JSON.stringify({
        type: "chat",
        payload: parsed.payload,
      });

      // broadcast only to users in same room
      allSockets.forEach((user) => {
        if (user.room === userRoom) {
          user.socket.send(msg);
        }
      });
    }
  });

  socket.on("close", () => {
    allSockets = allSockets.filter((u) => u.socket !== socket);
  });
});
