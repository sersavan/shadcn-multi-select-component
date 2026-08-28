/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": ["babel-jest", { configFile: "./babel.jest.config.js" }],
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "<rootDir>/__mocks__/styleMock.js",
  },
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)"
  ],
      transformIgnorePatterns: [
      "/node_modules/(?!(next|@react-icons|@heroicons|react-markdown|remark-gfm|rehype-highlight|unified|@types/hast|@types/unist|@types/mdast|vfile|unist|rehype|remark|react-syntax-highlighter)/)"
    ],  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};