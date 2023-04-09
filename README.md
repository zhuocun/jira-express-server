# jira-express-server

`jira-express-server` is an Express-based back-end server for a Jira-like project management application. This server is responsible for handling RESTFul API requests and managing data storage using both MongoDB and DynamoDB.

## Technologies

The project utilizes the following technologies:

-   **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine, used for running server-side JavaScript code.
-   **Express.js**: A fast and minimal web application framework for Node.js, used for building the API.
-   **MongoDB**: A NoSQL document-oriented database, used for storing flexible and scalable data.
-   **Mongoose**: An Object Data Modeling (ODM) library for MongoDB, providing a schema-based solution to model data.
-   **DynamoDB**: A managed NoSQL database service provided by Amazon Web Services (AWS), offering a scalable and low-latency solution for data storage.
-   **AWS SDK**: The official AWS SDK for JavaScript, used for interacting with AWS services such as DynamoDB.
-   **JSON Web Tokens (JWT)**: A compact and self-contained way for securely transmitting information between parties as a JSON object, used for authentication and authorization.

## Configuration

This project uses a combination of dependencies and devDependencies to ensure smooth development and efficient production builds. Some of the key packages include:

-   **dotenv**: A zero-dependency module that loads environment variables from a `.env` file.
-   **eslint**: A pluggable JavaScript linter used for identifying and reporting patterns in code.
-   **prettier**: An opinionated code formatter for consistent code style across the project.
-   **husky**: A tool for managing Git hooks, ensuring code quality before committing changes.
-   **lint-staged**: A package to run linters on Git staged files, used in conjunction with Husky for pre-commit checks.
-   **jest**: A JavaScript testing framework for writing and running tests.
-   **typescript**: A typed superset of JavaScript, adding optional static types for improved development experience and catching errors during compilation.

The project is configured with scripts to streamline the development process, including scripts for starting the server, running linters, and performing pre-commit checks.

For a full list of dependencies, please refer to the `package.json` file.
