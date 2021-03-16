import chalk from "chalk";

class Logger {
  isErrorObject(value) {
    return value && value instanceof Error;
  }

  getErrorMessage(value) {
    const isErrorObject = this.isErrorObject(value);

    if (isErrorObject) {
      return value?.message || value?.reason || value;
    }

    return value;
  }

  log(message = "") {
    if (message) {
      console.log(`${message}`);
    }
  }

  info(message) {
    this.log(chalk.blue(this.getErrorMessage(message)));
    this.externalHandler(message);
  }

  success(message) {
    this.log(chalk.green(this.getErrorMessage(message)));
    this.externalHandler(message);
  }

  warn(message) {
    this.log(chalk.yellow(this.getErrorMessage(message)));
    this.externalHandler(message);
  }

  error(error) {
    this.log(chalk.red(this.getErrorMessage(error)));
    this.externalHandler(error);
  }

  externalHandler(message) {
    // NOTE: Implement calls to third-party logging services here.
  }
}

export default new Logger();
