import Mongo from "mongodb";
import chalk from "chalk";
import mongoUri from "mongo-uri-tool";
import ps from "ps-node";
import synchronizedPromise from "synchronized-promise";
import settings from "./settings";

const cleanupMongoDBProcess = () => {
  if (process.isReset && process.mongoProcessId) {
    ps.kill(process.mongoProcessId);
  }
};

const getConnectionOptions = () => {
  try {
    const mongodbSettings = settings?.databases?.mongodb;
    const uri = mongodbSettings?.uri;

    if (!mongodbSettings || (mongodbSettings && !uri)) {
      throw new Error(
        chalk.redBright(
          "Must have a valid databases.mongodb.uri value in your settings-<env>.json file to connect to MongoDB."
        )
      );
    }

    return {
      uri,
      parsedUri: mongoUri.parseUri(uri),
      options: Object.assign({}, mongodbSettings.options),
    };
  } catch (exception) {
    cleanupMongoDBProcess();
    console.log(exception);
  }
};

const connectToMongoDB = async () => {
  const connectionOptions = getConnectionOptions();

  if (!process.mongodb && connectionOptions) {
    const mongodb = await Mongo.MongoClient.connect(connectionOptions.uri, {
      poolSize: process.env.NODE_ENV === "development" ? 10 : 100,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      authSource: "admin",
      ssl: process.env.NODE_ENV === "production",
      ...connectionOptions.options,
    });

    const db = mongodb.db(connectionOptions.parsedUri.db);

    return {
      db,
      Collection: db.collection.bind(db),
      connection: mongodb,
    };
  }

  return null;
};

const mongodb = synchronizedPromise(connectToMongoDB);

export default mongodb();
