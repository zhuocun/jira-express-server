import { postgresPool } from "../../database.js";

const createPGUsersTable = async (): Promise<void> => {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      _id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      "likedProjects" TEXT[] DEFAULT ARRAY[]::TEXT[],
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `;

    await postgresPool.query(createTableQuery);
};

export default createPGUsersTable;
