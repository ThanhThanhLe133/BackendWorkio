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
        // Allow requests from the configured client URL or (for dev) allow any origin.
        // Using `true` reflects the request origin, avoiding CORS blocks during development.
        origin: process.env.CLIENT_URL || true,
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
