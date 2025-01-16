import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";

async function main() {
  try {
    // connect to the database
    await mongoose.connect(config.databaseURL as string);

    // start the server
    app.listen(config.port, () => {
      console.log(`server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error(error);
  }
}

main();
