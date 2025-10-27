import { appendFile, mkdir } from "fs/promises";
import { Request } from "express";
import { appendFileSync } from "fs";

interface LogData {
  timestamp?: string;
  request?: string;
  url?: string;
  query?: string;
  body?: string;
  method?: string;
  response?: string;
  error?: string;
  totalTime?: number;
  startTime?: number;
}

interface CollectParams {
  request?: Request;
  responseBody?: unknown;
  error?: Error;
}

export interface LogConfig {
  logPath: string;
}

export class LogService {
  private logData: LogData = {};
  constructor(private config: LogConfig) {}

  public start() {
    const start = Date.now();
    this.logData.startTime = start;
    this.logData.timestamp = Date();
  }

  public collect(collectParams: CollectParams) {
    if (collectParams.request) {
      this.logData.method = collectParams.request.method;
      this.logData.url = collectParams.request.originalUrl;
      this.logData.query = JSON.stringify(collectParams.request.query);
      this.logData.request = JSON.stringify(collectParams.request.body);
    }
    if (collectParams.error) {
      this.logData.error = collectParams.error.toString();
    }

    if (collectParams.responseBody != undefined) {
      this.logData.response =
        typeof collectParams.responseBody === "object"
          ? JSON.stringify(collectParams.responseBody)
          : (this.logData.response = String(collectParams.responseBody));
    }
  }

  public log() {
    const end = Date.now();
    this.logData.totalTime = end - this.logData.startTime;
    const log = JSON.stringify(this.logData) + "\n";

    appendFileSync(this.config.logPath, log);
  }
}
