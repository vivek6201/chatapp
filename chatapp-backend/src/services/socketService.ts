import { Server } from "socket.io";

class SocketService {
  private _io: Server;

  constructor() {
    console.log("init socket service");
    this._io = new Server();
  }

  public initListener() {
    const io = this.io;
    io.on("connect", (socket) => {
      console.log("new socket connected", socket.id);
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
