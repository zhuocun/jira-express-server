import { postgresPool } from "../../database.js";

const createPostgreSQLTable = async (query: string): Promise<void> => {
    await postgresPool.query(query);
};

export { createPostgreSQLTable };
