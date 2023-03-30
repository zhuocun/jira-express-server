/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    moduleFileExtensions: ["js", "jsx", "ts"],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    moduleNameMapper: {
        "^(.*)\\.js$": "$1"
    },
    preset: "ts-jest",
    testEnvironment: "node"
};
