import { ExpiredSessionException } from "@session/exceptions/expired-session.exception";
import { SessionNotFoundException } from "@session/exceptions/session-not-found.exception";
import { SessionService } from "@session/services/session.service";
import { isExpiredDate, toSqlDateTime } from "@shared/date.utils";
import { NextFunction, Request, Response } from "express";
import { ExceptionService } from "@shared/services/exception.service";

export class SessionMiddleware {
  constructor(
    private readonly sessionService: SessionService,
    private readonly exceptionService: ExceptionService
  ) {}

  public async handle(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    if (request.originalUrl === "/login") {
      return next();
    }
    const tokenHeaders = request.headers.token;
    const token = Array.isArray(tokenHeaders)
      ? tokenHeaders.pop()
      : tokenHeaders;
    try {
      await this.validateToken(token);
      await this.sessionService.update({ token });
      next();
    } catch (error) {
      const errorResponse = this.exceptionService.handle(error);

      response
        .status(errorResponse.httpCode)
        .send({ errorMessage: errorResponse.errorMessage });
    }
  }

  private async validateToken(token: string): Promise<void> {
    if (!token || typeof token !== "string" || token.trim() === "") {
      throw new SessionNotFoundException();
    }
    const session = await this.sessionService.getOne({ token });
    if (!session) {
      throw new SessionNotFoundException();
    }
    const updatedAt = new Date(session.updated_at);
    if (isExpiredDate(updatedAt, session.session_extension_minutes)) {
      throw new ExpiredSessionException();
    }
    return;
  }
}
