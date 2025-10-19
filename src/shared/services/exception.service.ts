import { Exception } from "@shared/exceptions/exception";
import { LogService } from "./log.service";
import { ErrorResponse } from "@shared/exceptions/error-response";

export class ExceptionService {
  constructor(
    private readonly logService: LogService,
  ) {}
  handle(error: Error): ErrorResponse {
    this.logService.collect({ error: error });
    if (error instanceof Exception) {
      const errorResponse = new ErrorResponse({
        httpCode: error.code,
        errorMessage: error.message,
      });
      return errorResponse;
    }
    const errorResponse = new ErrorResponse({
      httpCode: 500,
      errorMessage: error.message,
    });
    return errorResponse;
  }
}
