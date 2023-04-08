import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import AWS from "aws-sdk";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import router from "./routes/index.route.js";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

const app = express();
dotenv.config();
app.use(express.json());
app.use(express.static("public"));
app.use(cors());
app.use(morgan("dev"));

app.use("/api/v1/", router);
const PORT = process.env.PORT != null ? process.env.PORT : 8080;

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

const main = async (): Promise<void> => {
    await mongoose.connect(
        process.env.MONGO_URI != null ? process.env.MONGO_URI : ""
    );
    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });
};

const dynamoDBDocument = DynamoDBDocument.from(
    new DynamoDB({ region: process.env.AWS_REGION })
);
const dynamoDB = new DynamoDB({ region: process.env.AWS_REGION });
main()
    .then(() => {
        console.log("Connect to MongoDB successfully.");
    })
    .catch((err) => {
        console.log(err);
        console.log("Connect to MongoDB failed.");
    });

export { dynamoDB, dynamoDBDocument };
