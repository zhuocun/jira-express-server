import { postgresPool } from "../../database.js";

const createTasksTable = async (): Promise<void> => {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS tasks (
      _id SERIAL PRIMARY KEY,
      "taskName" VARCHAR(255) NOT NULL,
      "coordinatorId" VARCHAR(255) NOT NULL,
      epic VARCHAR(255) NOT NULL,
      "columnId" VARCHAR(255) NOT NULL,
      note TEXT NOT NULL,
      type VARCHAR(255) NOT NULL,
      "projectId" VARCHAR(255) NOT NULL,
      "storyPoints" INTEGER NOT NULL,
      index INTEGER NOT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `;

    await postgresPool.query(createTableQuery);
};

export default createTasksTable;
