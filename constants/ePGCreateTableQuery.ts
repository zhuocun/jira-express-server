enum EPGCreateTableQuery {
    UUID = "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"",
    USER = `CREATE TABLE IF NOT EXISTS users (
      _id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      "likedProjects" TEXT[] DEFAULT ARRAY[]::TEXT[],
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,
    PROJECT = `
    CREATE TABLE IF NOT EXISTS projects (
      _id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      "projectName" VARCHAR(255) NOT NULL,
      organization VARCHAR(255) NOT NULL,
      "managerId" VARCHAR(255) NOT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `,
    TASK = `
    CREATE TABLE IF NOT EXISTS tasks (
      _id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  `,
    COLUMN = `
    CREATE TABLE IF NOT EXISTS columns (
      _id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      "columnName" VARCHAR(255) NOT NULL,
      "projectId" VARCHAR(255) NOT NULL,
      index INTEGER NOT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `
}

export default EPGCreateTableQuery;
