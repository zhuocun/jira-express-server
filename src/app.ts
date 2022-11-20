import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import { mongoURI } from "./configs/default.config.js";
import router from "./routes/index.route.js";

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(cors());
app.use(morgan("dev"));

app.use("/api/v1/", router);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

const main = async () => {
    await mongoose.connect(mongoURI);
};

main()
    .then(() => {
        console.log("Connect to MongoDB successfully.");
    })
    .catch((err) => {
        console.log(err);
        console.log("Connect to MongoDB failed.");
    });
