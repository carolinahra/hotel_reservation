import { Exception } from "@shared/exceptions/exception";

export class ExpiredSessionException extends Exception {
  code = 403;
  constructor(message?: string) {
    super(message || "Session Expired");
  }
}
