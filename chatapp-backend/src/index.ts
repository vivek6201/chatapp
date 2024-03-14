import express from "express";
import { configDotenv } from "dotenv";
import cors from "cors";
import routes from "./routes/index";
import SocketService from "./services/socketService";
import http from "http";

//loading env variables
configDotenv();

//initializing the express app
const app = express();

// attaching httpServer to express
const httpServer = http.createServer(app);
const PORT = process.env.PORT;

//attaching socket service to httpServer
const socketService = new SocketService();
socketService.io.attach(httpServer);

//used to parse JSON data
app.use(express.json());
app.use(cors());

//mouting all routes to /api/v1 path.
app.use("/api/v1", routes);

//running server on the port
app.listen(PORT, () => {
  console.log("Server is up at " + PORT);
});

socketService.initListener();
