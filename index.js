import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import initRoutes from "./src/routers/index.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initRoutes(app);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}`);
});
