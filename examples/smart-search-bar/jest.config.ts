import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFiles: [],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
          module: "commonjs",
          moduleResolution: "node",
          esModuleInterop: true,
          resolveJsonModule: true,
          paths: { "@/*": ["./src/*"] },
          baseUrl: ".",
        },
      },
    ],
  },
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
};

export default config;
