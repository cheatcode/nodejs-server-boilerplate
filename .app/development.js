/* eslint-disable consistent-return */

import chalk from "chalk";
import util from "util";
import child_process, { spawn } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";
import commandExists from "command-exists";
import webpack from "webpack";
import ps from "ps-node";
import Loader from "./loader";
import serverConfig from "../webpack.config";

const isWindows = os.platform() === "win32";
const exec = util.promisify(child_process.exec);

const handleCleanup = (processIds = []) => {
  process.loader.stop();

  processIds.forEach((processId) => {
    ps.kill(processId);
  });
  process.exit();
};

const handleSignalEvents = (processIds = []) => {
  process.on("SIGINT", () => handleCleanup(processIds));
  process.on("SIGTERM", () => handleCleanup(processIds));
};

const handleServerProcessMessages = () => {
  process.serverProcess.on("message", (message) => {
    const processMessages = ["server_closed"];

    if (!processMessages.includes(message)) {
      process.loader.stable(message);
    }
  });
};

const handleServerProcessSTDIO = () => {
  try {
    if (process.serverProcess) {
      process.serverProcess.on("error", (error) => {
        console.log(error);
      });

      process.serverProcess.stdout.on("data", (data) => {
        console.log(data.toString());
      });

      process.serverProcess.stderr.on("data", (data) => {
        process.loader.stop();
        console.log(chalk.redBright(data.toString()));
      });
    }
  } catch (exception) {
    throw new Error(
      `[actionName.handleServerProcessSTDIO] ${exception.message}`
    );
  }
};

const startApplicationProcess = () => {
  const serverProcess = child_process.fork(path.resolve("dist/index.js"), [], {
    // NOTE: Pipe stdin, stdout, and stderr. IPC establishes a message channel so we
    // communicate with the child_process.
    silent: true,
  });

  process.serverProcess = serverProcess;

  handleServerProcessSTDIO();
  handleServerProcessMessages();
};

const restartApplicationProcess = () => {
  if (process.serverProcess && process.serverProcess.pid) {
    ps.kill(process.serverProcess.pid);
    startApplicationProcess();
  }
};

const startWebpack = () => {
  process.loader.text("Building application...");

  const serverCompiler = webpack(serverConfig);

  serverCompiler.watch({}, (error, stats) => {
    if (error) {
      console.error(error.stack || error);
      if (error.details) {
        console.error(error.details);
      }
      return;
    }

    if (stats.hasErrors()) {
      process.loader.stop();
      console.log(
        `\n${chalk.yellowBright("Errors occurred during the build process:")}`
      );

      console.log(
        stats.toString({
          assets: false,
          builtAt: false,
          cachedAssets: false,
          cachedModules: false,
          chunks: false,
          colors: true,
          entrypoints: false,
          hash: false,
          modules: false,
          timings: false,
          version: false,
        })
      );
    }
  });

  serverCompiler.hooks.done.tap("App", () => {
    if (!process.serverProcess) {
      process.loader.text("Starting server...");
      startApplicationProcess();
    } else {
      process.loader.stop();
      process.loader.start("Restarting server...");
      restartApplicationProcess();
    }
  });
};

const getMongoProcessId = (stdout = null) => {
  const forkedProcessId = stdout && stdout.match(/forked process:+\s[0-9]+/gi);
  const processId =
    forkedProcessId &&
    forkedProcessId[0] &&
    forkedProcessId[0].replace("forked process: ", "");

  return processId && parseInt(processId, 10);
};

const startMongoDB = async () => {
  process.loader.text("Starting MongoDB...");

  const dataDirectoryExists = fs.existsSync(".data/mongodb");

  if (!dataDirectoryExists) {
    fs.mkdirSync(".data/mongodb", { recursive: true });
  }

  if (isWindows) {
    const currentPath = process.cwd();
    const mongodbVersions = fs
      .readdirSync(`C:\\Program Files\\MongoDB\\Server\\`)
      .sort()
      .reverse();
    const latestMongodbVersion = mongodbVersions && mongodbVersions[0];

    if (isWindows && mongodbVersions && mongodbVersions.length === 0) {
      console.log(
        chalk.red(
          "Couldn't find any MongoDB versions in C:\\Program Files\\MongoDB\\Server. Please double-check your MongoDB installation or re-install MongoDB and try again.\n"
        )
      );
      process.exit(1);
      return;
    }

    const mongodbWindowsCommand = `C:\\Program Files\\MongoDB\\Server\\${latestMongodbVersion}\\bin\\mongod`;
    spawn(mongodbWindowsCommand, [
      "--dbpath",
      `${currentPath}/.data/mongodb`,
      "--quiet",
    ]);

    return true;
  }

  const { stdout } = await exec(
    "mongod --port 27017 --dbpath ./.data/mongodb --quiet --fork --logpath ./.data/mongodb/log"
  );
  return getMongoProcessId(stdout);
};

const warnMongoDBMissing = () => {
  console.warn(`
  ${chalk.red("MongoDB not installed.")}\n
  ${chalk.green(
    "Download MongoDB at https://www.mongodb.com/try/download/community"
  )}

  After installation, try to run this command again to start MongoDB alongside your app.\n
  `);
};

const developmentServer = async () => {
  process.loader = new Loader({ defaultMessage: "Starting server..." });

  const mongodbExists = commandExists.sync("mongod");

  if (mongodbExists) {
    const mongoProcessId = await startMongoDB();
    startWebpack();
    handleSignalEvents(isWindows ? [] : [mongoProcessId]);
  } else {
    process.loader.stop();
    warnMongoDBMissing();
    process.exit(1);
  }
};

(async () => developmentServer())();
