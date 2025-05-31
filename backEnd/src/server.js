import express from "express";
import dotenv from "dotenv";
import { initDb } from "./config/db.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import transactionsRoutes from "./routes/transactionsRoute.js"
dotenv.config();

const app = express();

app.use(rateLimiter);
//middleware to access json body
app.use(express.json());

app.use("/api", transactionsRoutes);

const PORT = process.env.PORT || 5001


initDb().then(() => {

    app.listen(PORT, () => {
        console.log("server is running on PORT:", PORT);

    })
})
