import { Server } from "http";
import { launchApp, setContainer } from "../../app";
import { DatabaseAsker, KyselyDatabaseAsker } from "./database.asker";
import { EmailServiceMock } from "./email.service.mock";
import { Container, DatabaseConfig } from "@shared/container";
import { exec } from "node:child_process";
import { resolve } from "node:path";
import { rejects } from "node:assert";

export class HotelHarness {
  private app: Server;
  public databaseAsker: DatabaseAsker;
  public container: Container;
  private databaseConfig: DatabaseConfig = {
    database: "test_hotels",
    driver: "mysql",
    host: "localhost",
    password: "",
    user: "carolina",
  };

  async setup() {
    // haz que espere a manita - si no lo ves, usa execSync

    await this.createDatabase();
    await this.dumpDatabase();

    const container = setContainer();
    this.container = container;
    const emailServiceMock = new EmailServiceMock();
    container.emailService = emailServiceMock;
    const { app } = launchApp(container);
    this.databaseAsker = new KyselyDatabaseAsker(container.database);
    this.app = app;
  }

  private createDatabase() {
    return new Promise((resolve, reject) => {
      exec(
        `mysql -u${this.databaseConfig.user} -h${this.databaseConfig.host} -e 'CREATE DATABASE IF NOT EXISTS ${this.databaseConfig.database}'`,
        (error, stdout, stderr) => {
          if (error) {
            return reject(error);
          }
          return resolve(stdout);
        },
      );
    });
  }

  private dumpDatabase() {
    return new Promise((resolve, reject) => {
      exec(
        `mysql -u${this.databaseConfig.user} -h${this.databaseConfig.host} ${this.databaseConfig.database} < src/e2e/utils/dump.sql`,
        (error, stdout, stderr) => {
          if (error) {
            return reject(error);
          }
          return resolve(stdout);
        },
      );
    });
  }

  async teardown() {
    this.app.close();
    await this.databaseAsker.close();
  }
}
