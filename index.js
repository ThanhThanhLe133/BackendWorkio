import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import initRoutes from "./src/routers/index.js";
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();
const server = http.createServer(app);

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicPath = path.join(__dirname, 'src', 'public');


app.use(express.static(publicPath));
// Dòng trên có nghĩa là: 
// Truy cập http://localhost:3000/uploads/anh.png -> tìm ở thư mục src/public/uploads/anh.png

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
