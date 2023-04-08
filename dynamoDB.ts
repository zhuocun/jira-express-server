import { dynamoDB } from "./app.js";

const userTableParams = {
    TableName: "User",
    KeySchema: [
        { AttributeName: "username", KeyType: "HASH" },
        { AttributeName: "email", KeyType: "RANGE" }
    ],
    AttributeDefinitions: [
        { AttributeName: "username", AttributeType: "S" },
        { AttributeName: "email", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    StreamSpecification: {
        StreamEnabled: false
    }
};

dynamoDB.createTable(userTableParams, (err: any, data: any) => {
    if (err != null) {
        console.error(
            "Unable to create table. Error JSON:",
            JSON.stringify(err, null, 2)
        );
    } else {
        console.log(
            "Created table. Table description JSON:",
            JSON.stringify(data, null, 2)
        );
    }
});
