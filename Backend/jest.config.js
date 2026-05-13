module.exports = {
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testMatch: ["**/tests/**/*.test.js"],
  clearMocks: true,
  forceExit: true,
};
