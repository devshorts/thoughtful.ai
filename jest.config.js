// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

// ensure all tests run in utc timezone
process.env.TZ = "UTC";
process.env.JEST_TEST = "true";

module.exports = {
  preset: process.env.CI ? undefined : "ts-jest",

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Automatically reset mock state between every test
  resetMocks: true,

  // A list of paths to directories that Jest should use to search for files in
  roots: [process.cwd() + "/src"],

  // The test environment that will be used for testing
  testEnvironment: "node",

  // Whether to use watchman for file crawling
  // watchman: true,
  globals: {
    "ts-jest": {
      // https://github.com/kulshekhar/ts-jest/issues/259#issuecomment-504088010
      maxWorkers: 1,
      diagnostics: false,
    },
  },
};
