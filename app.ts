import express from "express";
import cors from "cors";
import morgan from "morgan";
import router from "./routes/index.route.js";
import { database, connectToDatabase } from "./database.js";

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(cors());
app.use(morgan("dev"));

app.use("/api/v1/", router);

const PORT = process.env.PORT ?? 8000;

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

connectToDatabase()
    .then(() => {
        console.log(`Connect to ${database} successfully.`);
    })
    .catch((err) => {
        console.log(err);
    });

export default app;
