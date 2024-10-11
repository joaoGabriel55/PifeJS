/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePaths: ["src"],
  moduleDirectories: ["node_modules"],
  moduleNameMapper: { '^(\\.|\\.\\.)\\/(.+)\\.js': '$1/$2' },
};