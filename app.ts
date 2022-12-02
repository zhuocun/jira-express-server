import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import router from "./routes/index.route.js";

dotenv.config();

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
    await mongoose.connect(process.env.MONGO_URI || "");
};

main()
    .then(() => {
        console.log("Connect to MongoDB successfully.");
    })
    .catch((err) => {
        console.log(err);
        console.log("Connect to MongoDB failed.");
    });
