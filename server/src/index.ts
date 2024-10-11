import { config } from "./config.js";
import { makeServer } from "./http/server.js";
import { makeDatabase } from "./infra/database/database.js";

const database = makeDatabase();

database
  .connect()
  .then(() => {
    const server = makeServer();

    server.listen(config.http.port, () => {
      console.log(`Server is running on port ${config.http.port}`);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
