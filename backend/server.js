import express from "express";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";
import connectMongoDb from "./db/connectMongoDB.js";

const app = express();

const PORT = process.env.PORT || 5000;
dotenv.config();

console.log(process.env.MONGO_URL)

app.get("/", (req, res)=>{
    res.send("server is running smotthly")
})

app.use("/api/auth", authRoutes);


app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
    connectMongoDb();
})
