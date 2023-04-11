import { postgresPool } from "../../database.js";

const createProjectsTable = async (): Promise<void> => {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      "projectName" VARCHAR(255) NOT NULL,
      organization VARCHAR(255) NOT NULL,
      "managerId" VARCHAR(255) NOT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `;

    await postgresPool.query(createTableQuery);
};

export default createProjectsTable;
