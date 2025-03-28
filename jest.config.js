module.exports = {
    transform: {
        "^.+\\.js$": "babel-jest"
    },
    transformIgnorePatterns: [
        "/node_modules/"
    ],
    moduleFileExtensions: ["js"],
    testEnvironment: "node",
    collectCoverage: true,
    coverageReporters: ["text", "lcov"],
    coverageThreshold: {
        global: {
            statements: 85,
            branches: 85,
            functions: 85,
            lines: 85
        }
    }
};