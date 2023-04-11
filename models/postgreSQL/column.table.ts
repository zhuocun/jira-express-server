import { postgresPool } from "../../database.js";

const createColumnsTable = async (): Promise<void> => {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS columns (
      _id SERIAL PRIMARY KEY,
      "columnName" VARCHAR(255) NOT NULL,
      "projectId" VARCHAR(255) NOT NULL,
      index INTEGER NOT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `;

    await postgresPool.query(createTableQuery);
};

export default createColumnsTable;
