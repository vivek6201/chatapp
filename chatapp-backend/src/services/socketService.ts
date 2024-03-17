import { Server } from "socket.io";

class SocketService {
  private _io: Server;

  constructor() {
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
  }

  public initListener() {
    const io = this.io;
    const users = new Map();

    io.on("connection", (socket) => {
      socket.on("add-user", (userId: string) => {
        if (userId !== "") {
          users.set(userId, socket.id);
        }
      });

      socket.on(
        "send-msg",
        (data: { message: any; to: string; from: string }) => {
          const sendUserSocket = users.get(data.to);
          if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-rec", {
              from: data.from,
              message: data.message,
            });
          }
        }
      );

      socket.on("typing", (data) => {
        const sendUserSocket = users.get(data.to);
        socket.to(sendUserSocket).emit("display-typing", {
          from: data.from,
          to: data.to,
        });
      });

      socket.on("stop-typing", (data) => {
        const sendUserSocket = users.get(data.to);
        socket.to(sendUserSocket).emit("stop-display-typing", {
          from: data.from,
          to: data.to,
        });
      });
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
