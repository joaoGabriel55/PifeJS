import type { Knex } from "knex";
import * as path from "path";
import { config } from "./src/config.js";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const commonConfig = {
  migrations: {
    directory: path.join(__dirname, "src/infra/database/migrations"),
  },
  seeds: {
    directory: path.join(__dirname, "src/infra/database/seeds"),
  },
};

type KnexConfig = {
  string?: Knex.Config;
};

const dbConfig = Object.entries(config.db).reduce<KnexConfig>(
  (knexConfig, [envName, envConfig]) => ({
    ...knexConfig,
    [envName]: {
      ...commonConfig,
      ...envConfig,
    },
  }),
  {}
);

export default dbConfig;
