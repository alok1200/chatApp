import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let userCount = 0;

wss.on("connection", (socket) => {
  userCount = userCount + 1;
  console.log("counting users #" + userCount);

  socket.on("message", (message) => {
    console.log("message received: " + message);
    setTimeout(() => {
      socket.send(message.toString() + ":send from server");
    }, 1000);
  });
});
